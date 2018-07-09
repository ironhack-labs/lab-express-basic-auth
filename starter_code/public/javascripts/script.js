document.addEventListener('DOMContentLoaded', () => {
  console.log('IronGenerator JS imported successfully!');

  $("#password").strengthify({
      zxcvbn: '/javascripts/zxcvbn.js',
      // messages displayed in the tooltip
      titles: ['Weakest', 'Weak', 'So-so', 'Good', 'Perfect'],
      // choose now between tooltip and element or both
      tilesOptions:{
        tooltip: true,
        element: false
      },
      // display tooltips
      drawTitles: false,
      // display text messages
      drawMessage: true,
      // display strenth indicator bars
      drawBars: true,
      // element after which the strengthify element should be inserted
      $addAfter: null
  });
    
}, false);
