const fs = require('fs');

const cubeHtml = `
<!DOCTYPE html>
<html>
<head>
<style>
  .cube-container {
    width: 24px;
    height: 24px;
    perspective: 100px;
    display: inline-block;
  }
  .cube {
    width: 100%;
    height: 100%;
    position: relative;
    transform-style: preserve-3d;
    transform: rotateX(-20deg) rotateY(-45deg);
  }
  .cube-face {
    position: absolute;
    width: 100%;
    height: 100%;
    border: 1.5px solid #fff;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 8px;
    font-weight: 900;
    box-sizing: border-box;
    font-family: sans-serif;
  }
  .cube-front {
    transform: translateZ(12px);
    color: #fff;
    background: transparent;
  }
  .cube-right {
    transform: rotateY(90deg) translateZ(12px);
    background: #fff;
    color: #000;
  }
  .cube-top {
    transform: rotateX(90deg) translateZ(12px);
    background: transparent;
  }
</style>
</head>
<body style="background: #111; color: white;">
  <div class="cube-container">
    <div class="cube">
      <div class="cube-face cube-front">3D</div>
      <div class="cube-face cube-right" style="font-size: 5px; transform: rotateY(90deg) translateZ(12px) rotateZ(-90deg);">PRINT</div>
      <div class="cube-face cube-top"></div>
    </div>
  </div>
</body>
</html>
`;
fs.writeFileSync('cube_test.html', cubeHtml);
console.log('Created cube_test.html');
