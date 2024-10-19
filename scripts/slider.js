class Carousel {
    carousel = null;
    selectedButton;

    constructor() {
        this.counter = 1;
        this.slidesTotal = 0;
        this.initCarousel();
        this.addEventListeners();
    }

    initCarousel() {
        this.carousel = document.querySelector('#carousel');
        this.slidesTotal = this.carousel.querySelectorAll('.slide').length;
        this.checkEdgeSlides();
    }

    checkEdgeSlides() {
        const btnPrev = this.carousel.querySelector('.controls__btn_prev');
        const btnNext = this.carousel.querySelector('.controls__btn_next');

        btnPrev.disabled = this.counter === 1;
        btnNext.disabled = this.counter === this.slidesTotal;
    }

    updateSelectBox = () => {
        const selectButtons = this.carousel.querySelectorAll('.controls__select-btn');
        let visibleSlideID = this.counter;
        let currentSelectBtn = [...selectButtons].find(btn => btn.dataset.id === visibleSlideID.toString());
        this.selectedButton?.classList.remove('controls__select-btn_active');
        this.selectedButton = currentSelectBtn;
        this.selectedButton?.classList.add('controls__select-btn_active');
    }

    animateSlide = () => {
        const dist = this.calculateDistance();
        const carouselContainer = this.carousel.querySelector('.carousel__container');
        carouselContainer.style.transform = `translateX(${dist}px)`;
    }

    calculateDistance = () => {
        const carouselContainer = this.carousel.querySelector('.carousel__container');
        const slide = carouselContainer.querySelector('.slide');
        const containerGap = parseFloat(window.getComputedStyle(carouselContainer).gap);
        const slideWidth = parseFloat(window.getComputedStyle(slide).width);
        return (-this.counter + 1) * (slideWidth + containerGap);
    }

    moveSlide() {
        this.animateSlide();
        this.updateSelectBox();
        this.checkEdgeSlides();
    }

    prev() {
        this.counter--;
        this.moveSlide();
    }

    next() {
        this.counter++;
        this.moveSlide();
    }

    onSelectBtnClick = (target) => {
        const selectButton = target.closest('.controls__select-btn');
        if (!selectButton) {
            return;
        }
        const slideID = selectButton.dataset.id;
        const event = new CustomEvent('slide-select', {
            bubbles: true,
            detail: slideID,
        });
        this.carousel.dispatchEvent(event);
    };

    updateCounter = (id) => this.counter = Number(id)

    addEventListeners() {
        this.carousel.addEventListener('pointerdown', ({target}) => {
            const prevBtn = target.closest('.controls__btn_prev');
            const nextBtn = target.closest('.controls__btn_next');
            const selectBtn = target.closest('.controls__select-btn');

            this.onSelectBtnClick(target);
            this.updateSelectBox();

            if (selectBtn) {
                this.moveSlide();
            }
            if (prevBtn) {
                this.prev();
            }
            if (nextBtn) {
                this.next();
            }
            this.checkEdgeSlides();

        });

        this.carousel.addEventListener('slide-select', ({detail}) => {
            this.updateCounter(detail);
        })

        window.addEventListener('DOMContentLoaded', () => {
            this.updateSelectBox();
        })
    }

}

let carousel = new Carousel();
carousel.initCarousel();
