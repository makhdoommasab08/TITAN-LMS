sed -i 's/const gl = canvas.getContext('"'"'2d'"'"');/const gl = canvas.getContext('"'"'webgl'"'"');/g' src/components/BackgroundShader.tsx
