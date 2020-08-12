window.addEventListener('load', () => {
  const el = $('#app');
  const nv = $('#nav');

  // Compile Handlebar Templates
  const errorTemplate = Handlebars.compile($('#error-template').html());
  const ratesTemplate = Handlebars.compile($('#rates-template').html());
  const exchangeTemplate = Handlebars.compile($('#exchange-template').html());
  const historicalTemplate = Handlebars.compile($('#historical-template').html());
  const loginTemplate = Handlebars.compile($('#login-template').html());
  const registerTemplate = Handlebars.compile($('#register-template').html());
  const welcomeTemplate = Handlebars.compile($('#welcome-template').html());
  const navTemplate = Handlebars.compile($('#nav-template').html());


  const isToday = (someDate) => {
    const today = new Date()
    return someDate.getDate() == today.getDate() &&
      someDate.getMonth() == today.getMonth() &&
      someDate.getFullYear() == today.getFullYear()
  }
  
  // Router Declaration
  const router = new Router({
    mode: 'history',
    page404: (path) => {
      const html = errorTemplate({
        color: 'yellow',
        title: 'Error 404 - Page NOT Found!',
        message: `The path '/${path}' does not exist on this site`,
      });
      el.html(html);
    },
  });

  // Instantiate api handler
  const api = axios.create({
    baseURL: 'http://localhost:3000/api',
    timeout: 5000,
  });

  // Display Error Banner
  const showError = (error) => {
    const { title, message } = error.response.data;
    const html = errorTemplate({ color: 'red', title, message });
    el.html(html);
  };

  // Display Latest Currency Rates
  router.add('/', async () => {
    // Display loader first
    let html = ratesTemplate();
    el.html(html);
    try {
      // Load Currency Rates
      const response = await api.get('/rates');
      const { base, date, rates } = response.data;
      // Display Rates Table
      html = ratesTemplate({ base, date, rates });
      el.html(html);
    } catch (error) {
      showError(error);
    } finally {
      // Remove loader status
      $('.loading').removeClass('loading');
    }
  });
  //==============================================================================
  // Perform POST request, calculate and display conversion results
  const getConversionResults = async () => {
    // Extract form data
    const from = $('#from').val();
    const to = $('#to').val();
    const amount = $('#amount').val();
    // Send post data to Express(proxy) server
    try {
      const response = await api.post('/convert', { from, to });
      const { rate } = response.data;
      const result = rate * amount;
      $('#result').html(`${to} ${result}`);
    } catch (error) {
      showError(error);
    } finally {
      $('#result-segment').removeClass('loading');
    }
  };

  // Handle Convert Button Click Event
  const convertRatesHandler = () => {
    if ($('.ui.form').form('is valid')) {
      // hide error message
      $('.ui.error.message').hide();
      // Post to Express server
      $('#result-segment').addClass('loading');
      getConversionResults();
      // Prevent page from submitting to server
      return false;
    }
    return true;
  };

  router.add('/exchange', async () => {
    // Display loader first
    let html = exchangeTemplate();
    el.html(html);
    try {
      // Load Symbols
      const response = await api.get('/symbols');
      const { symbols } = response.data;
      html = exchangeTemplate({ symbols });
      el.html(html);
      $('.loading').removeClass('loading');
      // Validate Form Inputs
      $('.ui.form').form({
        fields: {
          from: 'empty',
          to: 'empty',
          amount: 'decimal',
        },
      });
      // Specify Submit Handler
      $('.submit').click(convertRatesHandler);
    } catch (error) {
      showError(error);
    }
  });
  //==============================================================================
  const getHistoricalRates = async () => {
    const date = $('#date').val();
    try {
      const response = await api.post('/historical', { date });
      const { base, rates } = response.data;
      const html = ratesTemplate({ base, date, rates });
      $('#historical-table').html(html);
    } catch (error) {
      showError(error);
    } finally {
      $('.segment').removeClass('loading');
    }
  };

  const historicalRatesHandler = () => {
    if ($('.ui.form').form('is valid')) {
      // hide error message
      $('.ui.error.message').hide();
      // Indicate loading status
      $('.segment').addClass('loading');
      getHistoricalRates();
      // Prevent page from submitting to server
      return false;
    }
    return true;
  };

  router.add('/historical', () => {
    // Display form
    const html = historicalTemplate();
    el.html(html);
    // Activate Date Picker
    $('#calendar').calendar({
      type: 'date',
      formatter: { //format date to yyyy-mm-dd
        date: date => new Date(date).toISOString().split('T')[0],
      },
    });
    // Validate Date input
    $('.ui.form').form({
      fields: {
        date: 'empty',
      },
    });
    $('.submit').click(historicalRatesHandler);
  });
  //==============================================================================
  const doLogin= async () => {
    const uname = $('#uname').val();
    const password = $('#password').val();
    try {
      const response = await api.post('/dologin', { uname , password});
      const { accessToken,refreshToken } = response.data;

      localStorage.setItem("accessToken", accessToken);
      const html = welcomeTemplate({ accessToken, refreshToken });
      /*
      {
        projects : [
          {title:'Project 1',location:'Atlanta, GA',description:'Te eum doming eirmod, nominati pertinacia argumentum ad his. Ex eam alia facete scriptorem, est autem aliquip detraxit at. Usu ocurreret referrentur at, cu epicurei appellantur vix. Cum ea laoreet recteque electram, eos choro alterum definiebas in. Vim dolorum definiebas an. Mei ex natum rebum iisque.'},
          
          {title:'Project 2',location:'New York, NY',description:'Te eum doming eirmod, nominati pertinacia argumentum ad his. Ex eam alia facete scriptorem, est autem aliquip detraxit at. Usu ocurreret referrentur at, cu epicurei appellantur vix. Cum ea laoreet recteque electram, eos choro alterum definiebas in. Vim dolorum definiebas an. Mei ex natum rebum iisque.'}
        ]
      }
      */
      $('#result').html(`${accessToken} ${refreshToken}`);
      el.html(html);
      $('#rrmenu').html(`<a class='item' href='/logout'>Logout</a>`);

    } catch (error) {
      showError(error);
    } finally {
      $('.segment').removeClass('loading');
    }
  };

  const loginHandler = () => {
    if ($('.ui.form').form('is valid')) {
      // hide error message
      $('.ui.error.message').hide();
      // Indicate loading status
      $('.segment').addClass('loading');
      var msg = localStorage.getItem("lastname");
      alert("Login Clicked " + msg);
      // Prevent page from submitting to server
      doLogin();
      return false;
    }
    return true;
  };

  router.add('/login', () => {
    localStorage.setItem("lastname", "Smith");
    const html = loginTemplate();
    el.html(html);
    // Validate Date input
    $('.ui.form').form({
      fields: {
        uname: 'empty',
        password: 'empty',
      },
    });
    $('.submit').click(loginHandler);
  });

  //==============================================================================
  router.add('/register', () => {
    const html = registerTemplate();
    el.html(html);

  });
  //==============================================================================
  // Navigate app to current url
  router.navigateTo(window.location.pathname);

  // Highlight Active Menu on Refresh/Page Reload
  const link = $(`a[href$='${window.location.pathname}']`);
  link.addClass('active');

  $('a').on('click', (event) => {
    // Block browser page load
    event.preventDefault();

    // Highlight Active Menu on Click
    const target = $(event.target);
    $('.item').removeClass('active');
    target.addClass('active');

    // Navigate to clicked url
    const href = target.attr('href');
    const path = href.substr(href.lastIndexOf('/'));
    router.navigateTo(path);
  });

});
