import { execFile as execFileCallback } from 'node:child_process'
import { cp, mkdtemp, rm, stat } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { basename, dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { promisify } from 'node:util'
import { CliCommand } from '@sidekick-coder/zenith-kit/server/services/CliService'
import { tryCatch } from '@sidekick-coder/zenith-kit/shared'

const execFile = promisify(execFileCallback)
const repositoryRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const releaseFiles = ['package.json', 'README.md', 'zenith.config.yml'] as const

async function operation<T>(label: string, action: () => Promise<T>) {
    console.info(`[release] ${label}`)

    const [error, result] = await tryCatch(action)
    if (error) {
        throw new Error(`${label} failed.`, { cause: error })
    }

    return result
}

async function run(command: string, args: string[], cwd: string) {
    return operation(`Running ${command} ${args.join(' ')} in ${cwd}`, () => execFile(command, args, {
        cwd,
        env: {
            ...process.env,
            INIT_CWD: cwd,
        },
    }))
}

async function exists(path: string) {
    const [error] = await tryCatch(() => stat(path))
    if (!error) {
        return true
    }

    if (typeof error === 'object' && error !== null && 'code' in error && error.code === 'ENOENT') {
        return false
    }

    throw error
}

async function main(message?: string) {
    const temporaryDirectory = await mkdtemp(join(tmpdir(), `${basename(repositoryRoot)}-release-`))
    const workingDirectory = join(temporaryDirectory, 'repository')
    const artifactsDirectory = join(temporaryDirectory, 'artifacts')
    const releaseWorktree = join(temporaryDirectory, 'release')
    let releaseWorktreeCreated = false

    const [error] = await tryCatch(async () => {
        await operation('Copying repository to a temporary directory', () => cp(repositoryRoot, workingDirectory, {
            recursive: true,
            filter: (source) => !['node_modules', 'dist'].includes(basename(source)),
        }))
        await run('npm', ['i'], workingDirectory)
        await run('npm', ['run', 'build'], workingDirectory)

        if (!await exists(join(workingDirectory, 'dist'))) {
            throw new Error('Build completed without creating dist.')
        }

        for (const file of releaseFiles) {
            if (!await exists(join(workingDirectory, file))) {
                throw new Error(`Release input is missing after build: ${file}`)
            }
        }

        await operation('Saving build artifacts', () => cp(
            join(workingDirectory, 'dist'),
            join(artifactsDirectory, 'dist'),
            { recursive: true },
        ))
        for (const file of releaseFiles) {
            await operation(`Saving ${file}`, () => cp(join(workingDirectory, file), join(artifactsDirectory, file)))
        }

        await run('git', ['worktree', 'add', '--detach', releaseWorktree], repositoryRoot)
        releaseWorktreeCreated = true

        const releaseExists = Boolean(
            (await run('git', ['branch', '--list', 'release'], repositoryRoot)).stdout.trim(),
        )

        if (releaseExists) {
            await run('git', ['switch', 'release'], releaseWorktree)
        } else {
            await run('git', ['switch', '--orphan', 'release'], releaseWorktree)
        }

        if ((await run('git', ['ls-files'], releaseWorktree)).stdout.trim()) {
            await run('git', ['rm', '-rf', '.'], releaseWorktree)
        }

        await operation('Copying build artifacts to the release branch', () => cp(
            join(artifactsDirectory, 'dist'),
            join(releaseWorktree, 'dist'),
            { recursive: true },
        ))
        for (const file of releaseFiles) {
            await operation(`Copying ${file} to the release branch`, () => cp(
                join(artifactsDirectory, file),
                join(releaseWorktree, file),
            ))
        }

        const commitMessage = message || (await run('git', ['rev-parse', '--abbrev-ref', 'HEAD'], repositoryRoot)).stdout.trim()

        await run('git', ['add', '-f', 'dist', ...releaseFiles], releaseWorktree)
        await run('git', ['commit', '--allow-empty', '-m', commitMessage], releaseWorktree)
    })

    const [cleanupError] = await tryCatch(async () => {
        if (releaseWorktreeCreated) {
            await run('git', ['worktree', 'remove', '--force', releaseWorktree], repositoryRoot)
        }

        await operation('Removing temporary files', () => rm(temporaryDirectory, { recursive: true, force: true }))
    })

    if (error && cleanupError) {
        throw new AggregateError([error, cleanupError], 'Release failed and temporary files could not be removed.')
    }

    if (error || cleanupError) {
        throw error || cleanupError
    }
}

const command = new CliCommand('release')

command
    .description('Build and commit release artifacts to the local release branch.')
    .option('-m, --message <message>', 'Commit message for the release branch')
    .action((options) => main(options.message))

void tryCatch(() => command.parseAsync()).then(([error]) => {
    if (error) {
        console.error(error)
        process.exitCode = 1
    }
})
