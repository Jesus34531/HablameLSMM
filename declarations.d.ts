// Esto le dice a TypeScript que los archivos .mp4 existen y son válidos
declare module '*.mp4' {
  const src: any;
  export default src;
}

// Ya que estás aquí, puedes agregar tus modelos 3D para que tampoco den error
declare module '*.glb';
declare module '*.gltf';