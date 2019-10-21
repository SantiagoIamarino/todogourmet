// Header account btn-------------------------------------------

function showDropdown(){
    $('.account .account-dropdown').slideToggle(300);
}


// Navbar Scroll--------------------------------------------------


function scrollToDiv(slideTo) {
    const marcas_div = $('.nuestras-marcas').offset().top;
    const contactanos_div = $('.contactanos').offset().top + 200;

    if (slideTo == 'contact') {
        $('html, body').animate({
            scrollTop: contactanos_div - 10
        }, 500);
    } else {
        $('html, body').animate({
            scrollTop: marcas_div - 10
        }, 500);
    }
}



// Button to top-----------------------------------------------

$(window).scroll(function() {
    if ($(this).scrollTop() > 600) {
        $('.to-top').fadeIn(300);
    } else {
        $('.to-top').fadeOut(300);
    }
})

function goToTop(animationTime = 500) {
    $('html, body').animate({
        scrollTop: 0
    }, animationTime);
    return false;
}

// Close login modal---------------------------------------------

function hideModal(){
    $('#loginModal').modal('hide');
}



