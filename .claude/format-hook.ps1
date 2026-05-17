$j = [Console]::In.ReadToEnd() | ConvertFrom-Json
$f = $j.tool_input.file_path
if ($f -and ($f -match 'apps[/\\][^/\\]+[/\\]src[/\\]')) {
    pnpm exec prettier --write $f 2>$null
}
exit 0
