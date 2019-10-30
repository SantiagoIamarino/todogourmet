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

let slideInterval = null;

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

    slideInterval = setInterval(() => {

        slideMarcas();

    }, 1800);


    $('#marcas_left').click(function() {


        clearInterval(slideInterval);

        slideMarcas('left');

    })

    $('#marcas_right').click(function() {
        clearInterval(slideInterval);

        slideMarcas('right');

    })

}

function stopSliderMarcas() {
    clearInterval(slideInterval);
}

// Edit products images---------------------------------

function openFileSelector(target) {
    if (target === 'edit') {
        const fileSelector = document.getElementById('edit_file_selector');
        fileSelector.click();
    } else {
        const fileSelector = document.getElementById('file_selector');
        fileSelector.click();
    }
}

// Admin panel scripts--------------------------------------------------

let body;

function loadScript() {
    body = document.body;
    let script = document.createElement('script');
    script.id = 'admin_scripts_loader';
    script.innerHTML = '';
    script.src = 'assets/admin/scripts/main.js';
    script.async = true;
    script.defer = true;
    body.appendChild(script);
};

function destroyScript() {
    const scriptLoader = document.getElementById('admin_scripts_loader');

    body.removeChild(scriptLoader);
}