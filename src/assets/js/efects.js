// Header account btn-------------------------------------------

function showDropdown() {
    $('.account .account-dropdown').slideToggle(300);
}

function hideDropdown() {
    $('.account .account-dropdown').slideUp(300);
    if(window.innerWidth <= 1000) {
        $('header .gourmet-navbar ul.navbar').slideUp(200);
    }
}


// Navbar Scroll--------------------------------------------------


function scrollToDiv(slideTo, timing = 500) {

    let retard = 0;

    if(timing === 0) {
        retard = 1000;
    }

    setTimeout(() => {
        const marcas_div = $('.nuestras-marcas').offset().top;
        const contactanos_div = $('.contactanos').offset().top;
    
    
        if (slideTo == 'contact') {
            $('html, body').animate({
                scrollTop: contactanos_div - 10
            }, timing);
        } else {
            $('html, body').animate({
                scrollTop: marcas_div - 10
            }, timing);
        }
    }, retard)

    
}

// Mobile navbar-----------------------------------------------

function showMenu() {
    $('header .gourmet-navbar ul.navbar').slideToggle(200);
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

// Tienda arrow down ----------------------------

let filtersSlided = false;

function handleFilters() {
    if(!filtersSlided) {
        $('.sidebar .filters-content').slideDown(300);
        $('.sidebar .sidebar-arrow i').removeClass('down');
        filtersSlided = true;
    }else{
        $('.sidebar .filters-content').slideUp(300);
        $('.sidebar .sidebar-arrow i').addClass('down');
        filtersSlided = false;
    }
}

// login---------------------------------------------

function showProductInfoModal() {
    $('#productInfoModal').modal('show');
}

function showLoginModal() {
    $('#loginModal').modal('show');
}

function hideModal() {
    $('#loginModal').modal('hide');
}

function handleAdditionalInfoModal(option){
    $('#additionalInfoModal').modal(option);
}



// Sidebar admin effects-------------------------------------------

var overlay = $('.overlay'),
    isClosed = true;

function hamburger_cross() {

    if (isClosed) {
        overlay.show();
        $('#hamburger_btn').removeClass('is-closed');
        $('#hamburger_btn').addClass('is-open')
        isClosed = false;
    } else {
        overlay.hide();
        $('#hamburger_btn').removeClass('is-open');
        $('#hamburger_btn').addClass('is-closed');
        isClosed = true;
    }
    $('#wrapper').toggleClass('toggled');
}

$('[data-toggle="offcanvas"]').click(function() {
    $('#wrapper').toggleClass('toggled');
});

// Close admin editmodal -----------------------------------

function closeEditModal( modalId ){
    $('#' + modalId).modal('hide');
    const modalBackdrops = document.getElementsByClassName('modal-backdrop');

    for (const modal of modalBackdrops) {
        modal.style.display = 'none';
    }
}
