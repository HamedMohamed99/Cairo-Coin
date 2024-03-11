function load_docs() {
  const elements = ['#home', '#keys', '#usage', '#plan', '#docs', '#account'];
  elements.forEach(element => {
    document.querySelector(element).style.display = element === '#docs' ? 'block' : 'none';
  });
  document.getElementById('reload').style.display = 'none';
  document.querySelector('#header_data').style.display = 'flex';
}