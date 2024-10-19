class InfiniteCarousel {
    carousel = null;
    cancelFnID = null;


    constructor({autoplay = true, autoplaySpeed, slideWidth = 375}) {
        this.counter = 1;
        this.slidesTotal = 0;
        this.visibleSlidesNum = 1;
        this.autoPlay = autoplay;
        this.slideInitialWidth = slideWidth;
        this.autoPlayInterval = autoplaySpeed;
        this.initCarousel();
        this.addEventListeners();
    }

    initCarousel() {
        this.carousel = document.querySelector('#infiniteCarousel');
        this.slidesTotal = this.carousel.querySelectorAll('.slide').length;
        this.initAutoPlay(this.autoPlayInterval);
        this.checkEdgeSlides();
    }

    calcVisibleSlidesNumber() {
        const carouselInnerWidth = parseFloat(window.getComputedStyle(this.carousel).width);
        const visibleSlides = Math.round(carouselInnerWidth / this.slideInitialWidth);
        this.carousel.style.setProperty('--carousel-visible-slides', `${visibleSlides}`);
        this.counter = visibleSlides;
        this.visibleSlidesNum = visibleSlides;
        return visibleSlides;
    }

    checkEdgeSlides() {
        const btnPrev = this.carousel.querySelector('.controls__btn_prev');
        const btnNext = this.carousel.querySelector('.controls__btn_next');

        btnPrev.disabled = this.counter === this.visibleSlidesNum;
        btnNext.disabled = this.counter === this.slidesTotal;

        if (this.autoPlay && btnNext.disabled && this.counter === this.slidesTotal) {
            this.counter -= this.counter;
            this.autoPlay = false;
            clearInterval(this.cancelFnID);
            this.restartCarousel()
        }
    }

    restartCarousel() {
        this.autoPlay = true;
        this.cancelFnID = null;
        this.counter = this.visibleSlidesNum - 1;
        setTimeout(() => {
            this.initAutoPlay(this.autoPlayInterval);
        }, 0)
    }

    updateCounter = () => {
        const carouselContainer = this.carousel.querySelector('.inf-carousel__container');
        let [curr, total] = this.carousel.querySelector('.controls__counter').children;
        let {id} = carouselContainer.children[this.counter - 1]?.dataset;
        curr.textContent = id;
        total.textContent = ` / ${this.slidesTotal}`;
    }


    moveSlide = () => {
        const carouselContainer = this.carousel.querySelector('.inf-carousel__container');
        const slide = carouselContainer.querySelector('.slide');
        const containerGap = parseFloat(window.getComputedStyle(carouselContainer).gap);
        const slideWidth = parseFloat(window.getComputedStyle(slide).width);
        const step = this.visibleSlidesNum > 1 ? this.counter - this.visibleSlidesNum : this.counter - 1;
        const dist = -step * (slideWidth + containerGap);
        carouselContainer.style.transform = `translateX(${dist}px)`;

        this.updateCounter();
        this.checkEdgeSlides();
    }


    initAutoPlay(t) {
        if (this.cancelFnID === null && this.autoPlay) {
            this.cancelFnID = setInterval(() => {
                this.next();
            }, t)
        }
    }


    prev() {
        this.counter--;
        this.moveSlide();
    }

    next() {
        this.counter++;
        this.moveSlide();
    }

    addEventListeners() {
        this.carousel.addEventListener('pointerdown', ({target}) => {
            const prevBtn = target.closest('.controls__btn_prev');
            const nextBtn = target.closest('.controls__btn_next');

            this.autoPlay = false;
            clearInterval(this.cancelFnID);
            this.updateCounter();

            if (prevBtn && !prevBtn.disabled) {
                this.prev();
            }
            if (nextBtn && !nextBtn.disabled) {
                this.next();
            }
            this.checkEdgeSlides();
        });

        window.addEventListener('resize', () => {
            this.visibleSlidesNum = this.calcVisibleSlidesNumber();
            this.counter = this.calcVisibleSlidesNumber();
            this.checkEdgeSlides();
            this.updateCounter();
        })

        window.addEventListener('DOMContentLoaded', () => {
            this.visibleSlidesNum = this.calcVisibleSlidesNumber();
            this.updateCounter();
        })
    }

}

const config = {
    autoplay: true,
    autoplaySpeed: 4000,
    slideWidth: 375
}
let infiniteCarousel = new InfiniteCarousel(config);
infiniteCarousel.initCarousel();