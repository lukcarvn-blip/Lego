const fs = require('fs');
let code = fs.readFileSync('src/index.css', 'utf8');

const mobileCartBtnCss = `
.mobile-add-cart-btn {
  display: none;
  width: 100%;
  margin-top: 1rem;
  padding: 0.75rem;
  background: var(--color-accent);
  color: #000;
  border: none;
  border-radius: var(--radius-sm);
  font-weight: 800;
  font-size: 0.85rem;
  letter-spacing: 0.5px;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  cursor: pointer;
  text-transform: uppercase;
}

@media (max-width: 1024px) {
  .mobile-add-cart-btn {
    display: flex;
  }
}
`;

if (!code.includes('.mobile-add-cart-btn')) {
  fs.writeFileSync('src/index.css', code + '\n' + mobileCartBtnCss, 'utf8');
  console.log('Successfully added mobile-add-cart-btn to index.css');
}
