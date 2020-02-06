(function($, window, document, undefined) {
  let pluginName = "strength",
    defaults = {
      strengthClass: "strength",
      strengthMeterClass: "strength_meter",
      strengthButtonClass: "button_strength",
      strengthButtonText: "Show Password",
      strengthButtonTextToggle: "Hide Password"
    };

  function Plugin(element, options) {
    this.element = element;
    this.$elem = $(this.element);
    this.options = $.extend({}, defaults, options);
    this._defaults = defaults;
    this._name = pluginName;
    this.init();
  }

  Plugin.prototype = {
    init: function() {
      let characters = 0;
      let capitalletters = 0;
      let loweletters = 0;
      let number = 0;
      let special = 0;

      let upperCase = new RegExp("[A-Z]");
      let lowerCase = new RegExp("[a-z]");
      let numbers = new RegExp("[0-9]");
      let specialchars = new RegExp("([!,%,&,@,#,$,^,*,?,_,~])");

      function GetPercentage(a, b) {
        return (b / a) * 100;
      }

      function check_strength(thisval, thisid) {
        if (thisval.length > 8) {
          characters = 1;
        } else {
          characters = 0;
        }
        if (thisval.match(upperCase)) {
          capitalletters = 1;
        } else {
          capitalletters = 0;
        }
        if (thisval.match(lowerCase)) {
          loweletters = 1;
        } else {
          loweletters = 0;
        }
        if (thisval.match(numbers)) {
          number = 1;
        } else {
          number = 0;
        }

        let total =
          characters + capitalletters + loweletters + number + special;
        let totalpercent = GetPercentage(7, total).toFixed(0);

        get_total(total, thisid);
      }

      function get_total(total, thisid) {
        $("#register-password").removeClass();
        $("#register-password-text").removeClass();
        $("#strength-text").empty();

        switch (total) {
          case 1:
            $("#register-password").addClass("veryweak");
            $("#register-password-text").addClass("veryweak");
            $("#strength-text").append("Strength: Very Weak");
            break;

          case 2:
            $("#register-password").addClass("weak");
            $("#register-password-text").addClass("weak");
            $("#strength-text").append("Strength: Weak");
            break;

          case 3:
            $("#register-password").addClass("medium");
            $("#register-password-text").addClass("medium");
            $("#strength-text").append("Strength: Medium");
            break;

          case 4:
            $("#register-password").addClass("strong");
            $("#register-password-text").addClass("strong");
            $("#strength-text").append("Strength: Strong");
            break;
        }

        $("#register-password").addClass("form-control");
        $("#register-password-text").addClass("form-control");
      }

      let isShown = false;
      let strengthButtonText = this.options.strengthButtonText;
      let strengthButtonTextToggle = this.options.strengthButtonTextToggle;

      thisid = this.$elem.attr("id");

      let inputText = `<input style="display:none" class="form-control" data-password="${thisid}" id="register-password-text" type="text">`;
      let showPasswordLink = `<a href="" data-password-button=${thisid}" class="${this.options.strengthButtonClass}">${this.options.strengthButtonText}</a>`;
      let strengthText = `<a id="strength-text"></a>`;

      this.$elem
        .addClass(this.options.strengthClass)
        .attr("data-password", thisid)
        .after(
          `
          ${inputText}
          <div class="info-password">
          ${showPasswordLink}
          ${strengthText}
          </div>
          `
        );

      this.$elem.bind("keyup keydown", function(event) {
        thisval = $("#" + thisid).val();
        $('input[type="text"][data-password="' + thisid + '"]').val(thisval);
        check_strength(thisval, thisid);
      });

      $('input[type="text"][data-password="' + thisid + '"]').bind(
        "keyup keydown",
        function(event) {
          thisval = $(
            'input[type="text"][data-password="' + thisid + '"]'
          ).val();
          $('input[type="password"][data-password="' + thisid + '"]').val(
            thisval
          );
          check_strength(thisval, thisid);
        }
      );

      $(document.body).on(
        "click",
        "." + this.options.strengthButtonClass,
        function(e) {
          e.preventDefault();

          thisclass = "hide_" + $(this).attr("class");
          console.log(isShown);
          if (isShown) {
            $('input[type="text"][data-password="' + thisid + '"]').hide();
            $('input[type="password"][data-password="' + thisid + '"]')
              .show()
              .focus();
            $('.button_strength')
              .removeClass(thisclass)
              .html(strengthButtonText);
            isShown = false;
          } else {
            $('input[type="text"][data-password="' + thisid + '"]')
              .show()
              .focus();
            $('input[type="password"][data-password="' + thisid + '"]').hide();
            $('.button_strength')
              .addClass(thisclass)
              .html(strengthButtonTextToggle);
            isShown = true;
          }
        }
      );
    }
  };

  $.fn[pluginName] = function(options) {
    return this.each(function() {
      if (!$.data(this, "plugin_" + pluginName)) {
        $.data(this, "plugin_" + pluginName, new Plugin(this, options));
      }
    });
  };
})(jQuery, window, document);
