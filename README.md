# MCP 

Add mcp to your zenith instance.


## How to use

After installing the plugin, you can use the mcp server that is runing in /mcp endpoint.

## How to inspect

You can use the inspector to inspect the mcp server.

```sh
npx @modelcontextprotocol/inspector
```

Add a server with the url of your zenith instance and the endpoint of mcp server.

```sh
url: http://localhost:3000/mcp
```

You will also need an API key to access the mcp server. You can get the API key from the zenith admin dashboard.

Add the API token via http header `Authorization: <API_KEY>`
