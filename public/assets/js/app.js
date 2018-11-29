$(document).ready(() => {
  $.ajax("/",{
    "method" : "GET"
  }).then(res => {
    console.log("Get completed!");
  });

  //Post article object to database when save button is clicked
  $(document).on('click', '.saveArticle', function() {
    const $article = $(this).parent();
    $.ajax('/articles/save', {
      'method' : 'POST',
      'data' : {
        'title': $article.children('.card-title').text().trim(),
        'img' : $article.children('.card-title').children(".article-image").attr("src"),
        'tagline' : $article.children('.card-subtitle').text().trim(),
        'link' : $article.children('.btn-primary').attr('href')
      }
    });
  });
});