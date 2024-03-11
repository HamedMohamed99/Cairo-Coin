function load_docs() {
    const elements = ['#home', '#keys', '#usage', '#plan', '#docs', '#reload'];
    elements.forEach(element => {
      document.querySelector(element).style.display = element === '#docs' ? 'block' : 'none';
    });
  
    document.querySelector('#header_data').style.display = 'flex';
  }