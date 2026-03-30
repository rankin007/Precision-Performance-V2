# Extraction Script: Equine Data Scavenger
# Objective: Pull raw biometric numbers from the legacy .docx files to populate V2 Supabase.

Add-Type -AssemblyName "System.IO.Compression.FileSystem"

function Extract-DocxText {
    param([string]$path)
    $tempFolder = Join-Path $env:TEMP ([Guid]::NewGuid().ToString())
    [System.IO.Compression.ZipFile]::ExtractToDirectory($path, $tempFolder)
    $xmlPath = Join-Path $tempFolder "word\document.xml"
    [xml]$xml = Get-Content $xmlPath
    $text = $xml.Document.body.InnerText
    Remove-Item $tempFolder -Recurse -ErrorAction SilentlyContinue
    return $text
}

$file1 = "knowledge-base\legacy-docs\TEST_SETS\Equine Precision Real Data Collected V4.docx"
$text = Extract-DocxText $file1
$text | Out-File "knowledge-base\legacy-docs\TEST_SETS\EXTRACTION_RAW.txt"
$text.Substring(0, [Math]::Min(2000, $text.Length))
