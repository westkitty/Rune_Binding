const button = document.getElementById('create-case');
button?.addEventListener('click', () => {
  const region = document.getElementById('app');
  if (region) region.textContent = 'Case creation will be available with local evidence storage.';
});
