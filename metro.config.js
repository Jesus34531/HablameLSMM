const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Extraemos las extensiones actuales
const { resolver: { assetExts } } = config;

// Sobrescribimos asegurando que TODO esté incluido y limpio
config.resolver.assetExts = [
  ...assetExts,
  'glb', 'gltf', 'obj', 'mtl', 'vrx', 'mp4', 'png', 'jpg'
];

module.exports = config;