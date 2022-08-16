import './style.css'

const app = document.getElementById('app');
const grid = document.createElement('div');
grid.className = 'grid'

for (let i = 0; i < 16; ++i) {
  const cell = document.createElement('div');
  cell.className = "cell";
  grid.appendChild(cell);

  const clickHandler = () => {
    cell.removeEventListener('click', clickHandler);
    const enlarging = !cell.classList.contains('cell--clicked');

    const before = cell.getBoundingClientRect();
    const opacityBefore = parseFloat(getComputedStyle(cell).getPropertyValue('opacity'));

    if (enlarging) {
      const ghost = document.createElement('div');
      ghost.className = "cell--ghost";
      grid.insertBefore(ghost, cell);
    } else {
      cell.previousSibling.remove();
    }
    cell.classList.toggle('cell--clicked');

    const after = cell.getBoundingClientRect();
    const opacityAfter = parseFloat(getComputedStyle(cell).getPropertyValue('opacity'));
    cell.style.opacity = opacityBefore;

    const dx = after.x - before.x;
    const dy = after.y - before.y;
    const dw = after.width / before.width;
    const dh = after.height / before.height;

    requestAnimationFrame(() => {
        cell.style.transformOrigin = "top left"
        cell.style.transform = `
          translate(${-dx}px, ${-dy}px)
          scale(${1 / dw}, ${1 / dh})
        `

        requestAnimationFrame(() => {
          cell.style.transition = 'transform 200ms ease, opacity 200ms ease'
          cell.style.transform = '';
          cell.style.opacity = opacityAfter;

          cell.addEventListener('transitionend', () => {
            cell.style.transition = '';
            cell.style.transformOrigin = '';
            cell.style.opacity = '';
            cell.addEventListener('click', clickHandler);
          });
        });
    });
  };

  cell.addEventListener('click', clickHandler);
}

app.appendChild(grid);
