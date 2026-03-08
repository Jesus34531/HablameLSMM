# ============================================================
# iniciar.ps1 - Script DEFINITIVO para HablameLSMM
# Ejecutar cada vez que conectes el celular
# ============================================================

$projectRoot = "C:\Users\Jesus Saucedo Zavala\HablameLSMM"
$gradleCache = "C:\Users\Jesus Saucedo Zavala\.gradle\caches"
$appJsonPath  = "$projectRoot\app.json"
$localProps   = "$projectRoot\android\local.properties"

Set-Location $projectRoot

# ============================================================
# PASO 1: Matar procesos Java/Gradle
# ============================================================
Write-Host ""
Write-Host "[ 1/7 ] Deteniendo procesos Java/Gradle..." -ForegroundColor Cyan
Get-Process -Name "java"   -ErrorAction SilentlyContinue | Stop-Process -Force
Get-Process -Name "gradle" -ErrorAction SilentlyContinue | Stop-Process -Force
Start-Sleep -Seconds 2

# ============================================================
# PASO 2: Limpiar metadata.bin corruptos
# ============================================================
Write-Host "[ 2/7 ] Limpiando cache corrupto de Gradle..." -ForegroundColor Cyan
Get-ChildItem -Path $gradleCache -Recurse -Filter "metadata.bin" -ErrorAction SilentlyContinue |
    ForEach-Object { Remove-Item -Force $_.FullName -ErrorAction SilentlyContinue }

# ============================================================
# PASO 3: Sobreescribir app.json correctamente como texto puro
# ============================================================
Write-Host "[ 3/7 ] Escribiendo app.json correcto..." -ForegroundColor Cyan

$appJsonContent = @'
{
  "expo": {
    "name": "Hablame LSMM",
    "slug": "HablameLSMM",
    "version": "1.0.0",
    "orientation": "portrait",
    "icon": "./assets/Logo_Hablame_LSM.png",
    "scheme": "hablamelsmm",
    "userInterfaceStyle": "automatic",
    "newArchEnabled": true,
    "ios": {
      "supportsTablet": true,
      "infoPlist": {
        "NSPhotoLibraryUsageDescription": "Allow $(PRODUCT_NAME) to access your photos",
        "NSPhotoLibraryAddUsageDescription": "Allow $(PRODUCT_NAME) to save photos",
        "NSCameraUsageDescription": "Allow $(PRODUCT_NAME) to use your camera",
        "NSMicrophoneUsageDescription": "Allow $(PRODUCT_NAME) to use your microphone"
      }
    },
    "android": {
      "adaptiveIcon": {
        "backgroundColor": "#E6F4FE",
        "foregroundImage": "./assets/Logo_Hablame_LSM.png"
      },
      "edgeToEdgeEnabled": true,
      "predictiveBackGestureEnabled": false,
      "package": "com.anonymous.HablameLSMM"
    },
    "web": {
      "output": "static",
      "favicon": "./assets/images/favicon.png"
    },
    "plugins": [
      "expo-router",
      [
        "expo-splash-screen",
        {
          "image": "./assets/images/splash-icon.png",
          "imageWidth": 200,
          "resizeMode": "contain",
          "backgroundColor": "#ffffff",
          "dark": {
            "backgroundColor": "#000000"
          }
        }
      ],
      [
        "@reactvision/react-viro",
        {
          "android": {
            "arMode": "AR_AND_VR"
          }
        }
      ],
      "expo-asset",
      [
        "expo-build-properties",
        {
          "android": {
            "newArchEnabled": true,
            "extraCmakeArguments": ["-DANDROID_STL=c++_shared"],
            "ndkVersion": "27.1.12297006"
          },
          "ios": {
            "newArchEnabled": true
          }
        }
      ]
    ],
    "experiments": {
      "typedRoutes": true,
      "reactCompiler": true
    }
  }
}
'@

[System.IO.File]::WriteAllText($appJsonPath, $appJsonContent, [System.Text.Encoding]::UTF8)
Write-Host "    app.json escrito correctamente." -ForegroundColor Green

# ============================================================
# PASO 4: Crear local.properties
# ============================================================
Write-Host "[ 4/7 ] Preparando local.properties..." -ForegroundColor Cyan
# Lo creamos antes del prebuild por si acaso, y tambien despues (prebuild --clean lo borra)
if (-not (Test-Path "$projectRoot\android")) {
    New-Item -ItemType Directory -Path "$projectRoot\android" -Force | Out-Null
}
[System.IO.File]::WriteAllText($localProps, "sdk.dir=C\:\\Users\\Jesus Saucedo Zavala\\AppData\\Local\\Android\\Sdk")
Write-Host "    local.properties listo." -ForegroundColor Green

# ============================================================
# PASO 5: Prebuild limpio
# ============================================================
Write-Host "[ 5/7 ] Ejecutando prebuild limpio (tarda unos minutos la primera vez)..." -ForegroundColor Cyan
npx expo prebuild --clean --platform android

if ($LASTEXITCODE -ne 0) {
    Write-Host "ERROR: prebuild fallo. Revisa los mensajes de arriba." -ForegroundColor Red
    exit 1
}

# Restaurar local.properties (prebuild --clean lo borra)
[System.IO.File]::WriteAllText($localProps, "sdk.dir=C\:\\Users\\Jesus Saucedo Zavala\\AppData\\Local\\Android\\Sdk")
Write-Host "    local.properties restaurado." -ForegroundColor Green

# ============================================================
# PASO 6: Parchear graphicsConversions.h
# ============================================================
Write-Host "[ 6/7 ] Buscando graphicsConversions.h para parchear..." -ForegroundColor Cyan
$archivos = Get-ChildItem -Path $gradleCache -Recurse -Filter "graphicsConversions.h" -ErrorAction SilentlyContinue
foreach ($archivo in $archivos) {
    $contenido = Get-Content $archivo.FullName -Raw
    if ($contenido -match 'return std::format\("\{\}%", dimension\.value\);') {
        $contenidoParchado = $contenido -replace 'return std::format\("\{\}%", dimension\.value\);', 'return folly::to<std::string>(dimension.value) + "%";'
        Set-Content -Path $archivo.FullName -Value $contenidoParchado -NoNewline
        Write-Host "    Parche aplicado: $($archivo.FullName)" -ForegroundColor Green
    }
}

# ============================================================
# PASO 7: Compilar y lanzar
# ============================================================
Write-Host "[ 7/7 ] Compilando y lanzando app..." -ForegroundColor Cyan
npx expo run:android

# Si falla, limpiar y reintentar una vez
if ($LASTEXITCODE -ne 0) {
    Write-Host ""
    Write-Host "Fallo el build. Limpiando y reintentando..." -ForegroundColor Yellow

    Get-Process -Name "java" -ErrorAction SilentlyContinue | Stop-Process -Force
    Start-Sleep -Seconds 2

    Get-ChildItem -Path $gradleCache -Recurse -Filter "metadata.bin" -ErrorAction SilentlyContinue |
        ForEach-Object { Remove-Item -Force $_.FullName -ErrorAction SilentlyContinue }

    $archivos = Get-ChildItem -Path $gradleCache -Recurse -Filter "graphicsConversions.h" -ErrorAction SilentlyContinue
    foreach ($archivo in $archivos) {
        $contenido = Get-Content $archivo.FullName -Raw
        if ($contenido -match 'return std::format\("\{\}%", dimension\.value\);') {
            ($contenido -replace 'return std::format\("\{\}%", dimension\.value\);', 'return folly::to<std::string>(dimension.value) + "%";') |
                Set-Content -Path $archivo.FullName -NoNewline
        }
    }

    Write-Host "Reintentando compilacion..." -ForegroundColor Cyan
    npx expo run:android
}ñ