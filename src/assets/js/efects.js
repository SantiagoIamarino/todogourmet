
// $(document).ready( function(){
    
// Navbar Scroll--------------------------------------------------


function scrollToDiv( slideTo ){
    const marcas_div = $('.nuestras-marcas').offset().top;
    const contactanos_div = $('.contactanos').offset().top;

    if( slideTo == 'contact' ){
        $('html, body').animate({
            scrollTop: contactanos_div - 10
        }, 500);
    }else{
        $('html, body').animate({
            scrollTop: marcas_div - 10
        }, 500);
    }
}


    
// Button to top-----------------------------------------------

$(window).scroll(function(){
    if ($(this).scrollTop() > 600) {
        $('.to-top').fadeIn(300);
    } else {
        $('.to-top').fadeOut(300);
    }
})

function goToTop(){
    $('html, body').animate({
        scrollTop : 0
    }, 500);
    return false;
}



// Slider--------------------------------------------------------


function slideControls( prevOrNext ){

    const prev = $('#slider_control_prev');
    const next = $('#slider_control_next');
    const slider_container = $('.slider-container');
    const slider = $('.slider-container ul');

    if(prevOrNext === 'prev'){
        if($(slider).css('margin-left') !== '0px'){
            $(slider).animate({
                'margin-left': '+=100%'
            }, "slow")
        }
    }else{
        if('-' + $(slider_container).css('width') !==  $(slider).css('margin-left')){
            $(slider).animate({
                'margin-left': '-=100%'
            }, "slow")
        }
    }

}


// Slider marcas----------------------------------------

function sliderMarcas(){

    const display = $('.nuestras-marcas .display .display-container');

    timesRight = 0;
    timesLeft = 0;

    goingTo = 'right';

    setInterval(() => {

        if(timesRight < 13  && goingTo === 'right'){
            $(display).animate({
                'left': '-=16.5%'
            }, 700)

            timesRight++;

            if(timesRight === 13){
                timesRight = 0;
                goingTo = 'left';
            }

            return;
        }
        if(timesLeft < 13  && goingTo === 'left'){
            $(display).animate({
                'left': '+=16.5%'
            }, 700)

            timesLeft++;

            if(timesLeft === 13){
                timesLeft = 0;
                goingTo = 'right';
            }

            return;
        } 

    }, 1800);
}

// } )
