param(
    [int]$Port = 8080
)

$docsRoot = (Get-Item (Join-Path $PSScriptRoot '..\docs')).FullName
$listener = [System.Net.Sockets.TcpListener]::new([System.Net.IPAddress]::Loopback, $Port)
$listener.Start()
Write-Output "Static server listening on http://localhost:$Port/ serving $docsRoot"

function Get-MimeType([string]$extension) {
    switch ($extension.ToLower()) {
        '.html' { return 'text/html; charset=utf-8' }
        '.htm'  { return 'text/html; charset=utf-8' }
        '.js'   { return 'application/javascript; charset=utf-8' }
        '.mjs'  { return 'application/javascript; charset=utf-8' }
        '.css'  { return 'text/css; charset=utf-8' }
        '.json' { return 'application/json; charset=utf-8' }
        '.svg'  { return 'image/svg+xml' }
        '.png'  { return 'image/png' }
        '.jpg'  { return 'image/jpeg' }
        '.gif'  { return 'image/gif' }
        '.wav'  { return 'audio/wav' }
        '.ico'  { return 'image/x-icon' }
        '.webmanifest' { return 'application/manifest+json' }
        default { return 'application/octet-stream' }
    }
}

try {
    while ($true) {
        $tcp = $listener.AcceptTcpClient()
        try {
            $stream = $tcp.GetStream()
            $reader = New-Object System.IO.StreamReader($stream)
            $requestLine = $reader.ReadLine()
            if (-not $requestLine) { $tcp.Close(); continue }

            $parts = $requestLine.Split(' ')
            if ($parts.Length -lt 2) { $tcp.Close(); continue }

            $rawUrl = $parts[1].Split('?')[0]
            if ($rawUrl -eq '' -or $rawUrl -eq '/') { $rawUrl = '/index.html' }
            $cleanRel = $rawUrl.TrimStart('/').Replace('/', '\')
            $fullPath = [System.IO.Path]::GetFullPath((Join-Path $docsRoot $cleanRel))

            if (-not $fullPath.StartsWith($docsRoot, [System.StringComparison]::OrdinalIgnoreCase) -or -not [System.IO.File]::Exists($fullPath)) {
                $bodyBytes = [System.Text.Encoding]::UTF8.GetBytes("404 Not Found")
                $header = "HTTP/1.1 404 Not Found`r`nContent-Length: $($bodyBytes.Length)`r`nConnection: close`r`n`r`n"
                $headerBytes = [System.Text.Encoding]::ASCII.GetBytes($header)
                $stream.Write($headerBytes, 0, $headerBytes.Length)
                $stream.Write($bodyBytes, 0, $bodyBytes.Length)
                $tcp.Close()
                continue
            }

            $ext = [System.IO.Path]::GetExtension($fullPath)
            $ctype = Get-MimeType $ext
            $fileBytes = [System.IO.File]::ReadAllBytes($fullPath)

            $header = "HTTP/1.1 200 OK`r`nContent-Type: $ctype`r`nContent-Length: $($fileBytes.Length)`r`nAccess-Control-Allow-Origin: *`r`nConnection: close`r`n`r`n"
            $headerBytes = [System.Text.Encoding]::ASCII.GetBytes($header)
            $stream.Write($headerBytes, 0, $headerBytes.Length)
            $stream.Write($fileBytes, 0, $fileBytes.Length)
            $stream.Flush()
            $tcp.Close()
        } catch {
            Write-Warning "Request error: $_"
            if ($tcp) { $tcp.Close() }
        }
    }
} finally {
    $listener.Stop()
}
