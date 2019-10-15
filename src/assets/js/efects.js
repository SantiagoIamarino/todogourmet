// $(document).ready( function(){

// Navbar Scroll--------------------------------------------------


function scrollToDiv(slideTo) {
    const marcas_div = $('.nuestras-marcas').offset().top;
    const contactanos_div = $('.contactanos').offset().top;

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

function goToTop() {
    $('html, body').animate({
        scrollTop: 0
    }, 500);
    return false;
}



// Slider--------------------------------------------------------


function slideControls(prevOrNext) {

    const prev = $('#slider_control_prev');
    const next = $('#slider_control_next');
    const slider_container = $('.slider-container');
    const slider = $('.slider-container ul');


    if (prevOrNext === 'prev') {
        const slider_left = parseInt($(slider).css('margin-left'));

        if (slider_left === -1400) {
            $(prev).css({
                'display': 'none'
            })
            $(next).css({
                'display': 'flex'
            })
        }

        if ($(slider).css('margin-left') !== '0px') {
            $(slider).animate({
                'margin-left': '+=100%'
            }, "slow")
        }

    } else {

        const slider_left = parseInt($(slider).css('margin-left'));
        const slider_width = parseInt($(slider).css('width'));


        if (slider_left - 1400 === (slider_width * -1)) {
            $(next).css({
                'display': 'none'
            })
            $(prev).css({
                'display': 'flex'
            })
        }


        if ('-' + $(slider_container).css('width') !== $(slider).css('margin-left')) {
            $(slider).animate({
                'margin-left': '-=100%'
            }, "slow")
        }
    }


}


// Slider marcas----------------------------------------

function sliderMarcas(imgsToSlide) {

    const display = $('.nuestras-marcas .display .display-container');

    
    imgsMaxToShow = 6;

    imgsToSlide = imgsToSlide - imgsMaxToShow;

    timesRight = 0;
    goingTo = 'right';



    function slideMarcas(changeTo) {

        if (changeTo) {
            goingTo = changeTo;
        }
        if (timesRight < imgsToSlide && goingTo === 'right') {
            $(display).animate({
                'left': '-=16.6%'
            }, 700)

            timesRight++;

            if (timesRight === imgsToSlide) {
                goingTo = 'left';
            }

            return;
        }
        if (timesRight > 0 && goingTo === 'left') {
            $(display).animate({
                'left': '+=16.6%'
            }, 700)

            timesRight--;

            if (timesRight === 0) {
                goingTo = 'right';
            }

            return;
        }
    }

    const slide = setInterval(() => {

        slideMarcas();

    }, 1800);


    $('#marcas_left').click(function() {


        clearInterval(slide);

        slideMarcas('left');

    })

    $('#marcas_right').click(function() {
        clearInterval(slide);

        slideMarcas('right');

    })

}

// } )