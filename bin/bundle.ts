import cp from "child_process";
import path from "path";
import fs from "fs";
import { readAndParse } from "@sidekick-coder/zenith-kit/server";

const pkg = await readAndParse(path.resolve(import.meta.dirname, "..", "package.json"))
const conf = await readAndParse(path.resolve(import.meta.dirname, "..", "zenith.config.yml"))

const name = conf.name || pkg.name;

const output = path.resolve(import.meta.dirname, "..", "out", `${name}-${pkg.version}.bundle`);

fs.mkdirSync(path.dirname(output), { recursive: true });

cp.execSync(`git bundle create ${output} --all`, {
    cwd: path.resolve(import.meta.dirname, ".."),
    stdio: "inherit",
});
