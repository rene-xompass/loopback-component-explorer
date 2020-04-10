;(function () {
  const $ = window.$;
  $(function () {
    const lsKey = 'swagger_accessToken';
    $.getJSON('config.json', function (config) {
      console.log(config);
      loadSwaggerUi(config);
    });

    var accessToken = window.localStorage ? window.localStorage.getItem('access_token') : null;

    function loadSwaggerUi(config) {
      window.ui = new SwaggerUIBundle({
        url: config.url || '/swagger/resources',
        dom_id: '#swagger-ui',
        deepLinking: true,
        presets: [
          SwaggerUIBundle.presets.apis,
          SwaggerUIStandalonePreset
        ],
        plugins: [
          SwaggerUIBundle.plugins.DownloadUrl
        ],
        docExpansion: 'none',
        layout: 'StandaloneLayout',
        requestInterceptor: function (request) {
          const authorization = request.headers.authorization;
          const accessToken = getParameterByName('access_token', request.url);

          if (window.localStorage && (authorization || accessToken)) {
            window.localStorage.setItem('access_token', authorization || accessToken);
          }
          return request;
        },
        onComplete: function () {
          if (accessToken) {
            window.ui.preauthorizeApiKey('accessToken', accessToken);
          }
        }
      });
    }
  });

  function getParameterByName(name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, '\\$&');
    var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
      results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, ' '));
  }
})();