const fs = require('fs');
let code = fs.readFileSync('src/index.css', 'utf8');

const regex = /\.leaderboard-coverflow-swiper \.swiper-slide \{[\s\S]*?transition: opacity 0\.3s;\s*\}/;

const replacement = `.leaderboard-coverflow-swiper .swiper-slide {
  background-position: center;
  background-size: cover;
  width: 280px;
  height: auto;
  opacity: 0.6;
  transition: opacity 0.3s;
}

@media (max-width: 768px) {
  .leaderboard-coverflow-swiper .swiper-slide {
    width: 200px;
  }
}`;

if (code.match(regex)) {
  code = code.replace(regex, replacement);
  fs.writeFileSync('src/index.css', code, 'utf8');
  console.log('Fixed index.css');
} else {
  console.log('Regex did not match.');
}
