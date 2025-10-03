// camila_guerraa 
  async function fetchInstagramData(username) {
  const response = await fetch(`https://api.instagapi.com/userinfo/${username}`);
  const result = await response.json();
  return result.data;
}

(async () => {
  const data = await fetchInstagramData('ejemplo');
  console.log('Bio:', data.biography);
  console.log('Seguidores:', data.edge_followed_by.count);
  console.log('Foto perfil:', data.profile_pic_url);
})();


    