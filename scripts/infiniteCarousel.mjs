import {createElement} from "./helpers/createElement.js";

export default class InfiniteCarousel {
    elem = null;
    cancelFn = null;


    constructor({players = [], autoplay = true, autoplaySpeed}) {
        this.players = players;
        this.counter = 1;
        this.slidesTotal = 0;
        this.visibleSlidesNum = 1;
        this.autoPlay = autoplay;
        this.autoPlayInterval = autoplaySpeed;
        this.render();
        this.addEventListeners();
        this.initCarousel();
    }

    render() {
        if (!this.elem) {
            this.elem = createElement(this.getCarousel(this.players));
        }
        return this.elem;
    }

    initCarousel() {
        this.slidesTotal = this.elem.querySelectorAll('.carousel-slide').length;
        this.cancelFn = this.initAutoPlay(this.autoPlayInterval);
        this.checkEdgeSlides();
    }

    calcVisibleSlidesNumber() {
        const slideInitialWidth = 375;
        const carouselInnerWidth = parseFloat(window.getComputedStyle(this.elem).width);
        return Math.round(carouselInnerWidth / slideInitialWidth);
    }

    checkEdgeSlides() {
        const btnPrev = this.elem.querySelector('.carousel-btn-prev');
        const btnNext = this.elem.querySelector('.carousel-btn-next');

        btnPrev.disabled = Math.abs(this.counter) === this.visibleSlidesNum;
        btnNext.disabled = Math.abs(this.counter) === this.slidesTotal;

        if (this.autoPlay && btnNext.disabled) {
            this.moveSlide();
            this.counter = -this.counter;
        }
    }

    updateCounter = () => {
        const carouselContainer = this.elem.querySelector('.carousel-container');
        let [curr, total] = this.elem.querySelector('.carousel-counter').children;
        let {id} = carouselContainer.children[this.counter - 1].dataset;
        curr.textContent = id;
        total.textContent = ` / ${this.slidesTotal}`;
    }

    getCarousel = (data) => {
        return `
            <div class="relative flex flex-col" style="--btn-bg-idle:#d9d9d9; --btn-bg-active:#313131;">
            <h2 class="font-Merriweather uppercase lg:text-[54px] lg:leading-[1.2] text-4xl font-normal leading-[1.1] mb-10">Участники турнира</h2>
            <div class="order-1 overflow-hidden">
                <ul class="carousel-container will-change-transform transition transform ease-in duration-300 flex flex-row flex-nowrap list-none">
                    ${this.getSlides(data)}
                </ul>
            </div>
            <div class="order-2 lg:absolute lg:top-0 lg:right-0 lg:m-0 mt-10 flex justify-center">
                <div class="flex justify-center items-center gap-3.5 mt-[calc(21px/2)]">
                    <button type="button"
                        class="carousel-btn-prev disabled:bg-[var(--btn-bg-idle)] disabled:pointer-events-none flex w-9 h-9 lg:w-11 lg:h-11 items-center justify-center rounded-full bg-yac-jet-100 transition ease-in-out duration-200 hover:bg-yac-sunglow-100">
                        <svg class="leading-none pointer-events-none w-[7px] h-[14px] lg:w-[8.5px] lg:h-[17px]" viewBox="0 0 10 18" fill="none"
                            xmlns="http://www.w3.org/2000/svg">
                            <path d="M8.07664 15.923L1.15357 8.9999L8.07664 2.07682" stroke="white" stroke-width="1.63636" stroke-linecap="square"/>
                        </svg>
                    </button>
                    <p class="carousel-counter">
                        <span class="text-base leading-[1.2] font-normal">1</span>
                        <span class="text-base leading-[1.2] font-normal text-yac-gray-100">6</span>
                    </p>    
                    <button type="button"
                        class="carousel-btn-next disabled:bg-[var(--btn-bg-idle)] disabled:pointer-events-none flex w-9 h-9 lg:w-11 lg:h-11 items-center justify-center rounded-full bg-yac-jet-100 transition ease-in-out duration-200 hover:bg-yac-sunglow-100">
                        <svg class="leading-none pointer-events-none w-[7px] h-[14px] lg:w-[8.5px] lg:h-[17px]" viewBox="0 0 10 18" fill="none"
                        xmlns="http://www.w3.org/2000/svg">
                            <path d="M1.92336 2.0769L8.84644 8.99998L1.92336 15.9231" stroke="white" stroke-width="1.63636" stroke-linecap="square"/>
                        </svg>
                    </button>
                </div>
            </div>
        </div>
          `;
    };

    getSlide = ({id, name, title, imageUrl}) => {
        return `
                <li data-id="${id}"
                    class="carousel-slide font-Golos flex flex-col lg:basis-[calc(theme(flexBasis.1/3))] basis-full flex-shrink-0 items-center">
                        <picture>
                            <source media="(max-width: 640px)"
                                    srcset="../assets/mobile/${imageUrl[1]}"/>
                            <source media="(min-width: 860px)"
                                    srcset="../assets/desktop/${imageUrl[0]}"/>
                            <img class=" w-auto h-full"
                                 src="../assets/desktop/${imageUrl[0]}" alt="Игрок в шахматы" alt="${title}"/>
                        </picture>
                        <h3 class="text-2xl leading-[1.2] font-semibold text-yac-jet-100 mt-7">${name}</h3>
                        <p class="text-xl leading-[1.2] font-normal text-yac-gray-100 mb-5 mt-2">${title}</p>
                        <a class="text-base leading-[1.2] font-medium rounded-full bg-transparent border border-yac-blue-100 p-3 text-yac-blue-100 transition-colors hover:bg-yac-blue-100 hover:cursor-pointer hover:text-white">Подробнее</a>
                </li>
            `;
    };

    getSlides = (data) => data.map(item => this.getSlide(item)).join('');

    moveSlide() {
        const slide = this.elem.querySelector('.carousel-slide');
        const carouselContainer = this.elem.querySelector('.carousel-container');
        const slideWidth = parseFloat(window.getComputedStyle(slide).width);
        let step = this.visibleSlidesNum > 1 ? -this.counter + this.visibleSlidesNum : -this.counter + 1;
        let dist = step * slideWidth;
        carouselContainer.style.transform = `translateX(${dist}px)`;

        this.updateCounter();
        this.checkEdgeSlides();
    }

    stopAutoPlay(fn, t) {
        this.autoPlay = false;
        setTimeout(fn, t);
    }

    initAutoPlay(t) {
        if (this.autoPlay) {
            let inner = setInterval(() => {
                this.next();
            }, t)
            return function cancelInner() {
                clearInterval(inner)
            }
        } else {
            return false;
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
        this.elem.addEventListener('pointerdown', ({target}) => {
            const prevBtn = target.closest('.carousel-btn-prev');
            const nextBtn = target.closest('.carousel-btn-next');

            this.stopAutoPlay(this.cancelFn, 0);

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
            this.updateCounter();
        })

        window.addEventListener('DOMContentLoaded', () => {
            this.visibleSlidesNum = this.calcVisibleSlidesNumber();
            this.counter = this.calcVisibleSlidesNumber();
            this.updateCounter();
        })
    }

}
