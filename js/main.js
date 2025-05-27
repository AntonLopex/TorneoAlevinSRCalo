document.addEventListener('DOMContentLoaded', () => {
  const toggleBtn = document.querySelector('.menu-toggle')
  const navMenu = document.querySelector('.nav-menu')

  // Verificamos si ya existe un listener para evitar la duplicación
  if (!toggleBtn.hasAttribute('data-listener')) {
    toggleBtn.addEventListener('click', (event) => {
      event.preventDefault()
      event.stopPropagation()

      // Alterna visibilidad del menú
      navMenu.classList.toggle('active')

      // Alterna clase 'open' para cambiar el icono hamburguesa a X
      toggleBtn.classList.toggle('open')
    })

    // Marcamos el botón para evitar que se añadan más listeners
    toggleBtn.setAttribute('data-listener', 'true')
  }
})

