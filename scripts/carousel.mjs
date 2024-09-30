import {createElement} from "./helpers/createElement.js";

export default class Carousel {
    elem = null;
    selectedButton;


    constructor({slides = []}) {
        this.counter = 1;
        this.slidesTotal = 0;
        this.slides = slides;
        this.render();
        this.addEventListeners();
        this.initCarousel();
    }

    render() {
        if (!this.elem) {
            this.elem = createElement(this.getCarousel(this.slides));
        }
        return this.elem;
    }

    initCarousel() {
        this.slidesTotal = this.elem.querySelectorAll('.yac-carousel-slide').length;
        this.checkEdgeSlides();
    }

    checkEdgeSlides() {
        const btnPrev = this.elem.querySelector('.yac-carousel-btn-prev');
        const btnNext = this.elem.querySelector('.yac-carousel-btn-next');

        btnPrev.disabled = this.counter === 1;
        btnNext.disabled = this.counter === this.slidesTotal;

    }

    updateSelectBox = () => {
        const selectButtons = this.elem.getElementsByClassName('yac-select-btn');
        let visibleSlideID = this.counter;
        let currentSelectBtn = [...selectButtons].find(btn => btn.dataset.id === visibleSlideID.toString());
        this.selectedButton?.classList.remove('yac-select-btn_active');
        this.selectedButton = currentSelectBtn;
        this.selectedButton?.classList.add('yac-select-btn_active');
    }

    getCarousel = (data) => {
        return `
            <div class="relative flex flex-col overflow-hidden" style="--btn-bg-idle:#d9d9d9; --btn-bg-active:#313131;">
            <h2 class="font-Merriweather uppercase text-4xl font-normal leading-[1.1] mb-3">Этапы преображения Васюков</h2>
            <p class="font-Golos text-lg leading-[1.2] text-yac-blue-100 font-normal">Будущие источники обогащения васюкинцев</p>
            <div class="yac-carousel relative mt-[var(--carousel-mt)]" >
               <div class="absolute top-0 left-0 w-full h-full z-10">
               <picture>
                     <source media="(max-width: 640px)"
                             srcset="../../../assets/mobile/plane_mobile.png"/>
                     <source media="(min-width: 860px)"
                             srcset="../../../assets/desktop/plane_desktop.png"/>
                     <img class="absolute block -top-1/2 left-[2%] w-full h-auto" 
                     src=".../../../assets/desktop/plane_desktop.png"
                     alt="Самолёт в небе"/>
               </picture>
            </div>
                <ul class="yac-carousel-container will-change-transform transition transform ease-in duration-300 flex flex-row flex-nowrap gap-8 list-none">
                    ${this.getSlides(data)}
                </ul>
            </div>
            <div class="flex justify-center mt-7">
                <div class="flex justify-center items-center gap-4">
                    <button type="button"
                        class="yac-carousel-btn-prev disabled:bg-[var(--btn-bg-idle)] disabled:pointer-events-none flex w-9 h-9 lg:w-11 lg:h-11 items-center justify-center rounded-full bg-yac-jet-100 transition ease-in-out duration-200 hover:bg-yac-sunglow-100">
                        <svg class="leading-none w-[7px] h-[14px] lg:w-[8.5px] lg:h-[17px]" viewBox="0 0 10 18" fill="none"
                            xmlns="http://www.w3.org/2000/svg">
                            <path d="M8.07664 15.923L1.15357 8.9999L8.07664 2.07682" stroke="white" stroke-width="1.63636" stroke-linecap="square"/>
                        </svg>
                    </button>
                    <div class="yac-carousel-select-box flex flex-row flex-nowrap gap-1.5">
                        ${this.getDots(data)}
                    </div>
                    <button type="button"
                        class="yac-carousel-btn-next disabled:bg-[var(--btn-bg-idle)] disabled:pointer-events-none flex w-9 h-9 lg:w-11 lg:h-11 items-center justify-center rounded-full bg-yac-jet-100 transition ease-in-out duration-200 hover:bg-yac-sunglow-100">
                        <svg class="leading-none w-[7px] h-[14px] lg:w-[8.5px] lg:h-[17px]" viewBox="0 0 10 18" fill="none"
                        xmlns="http://www.w3.org/2000/svg">
                            <path d="M1.92336 2.0769L8.84644 8.99998L1.92336 15.9231" stroke="white" stroke-width="1.63636" stroke-linecap="square"/>
                        </svg>
                    </button>
                </div>
            </div>
        </div>
          `;
    };

    getDot = ({id}) => {
        return `
            <button type="button" data-id="${id}" class="yac-select-btn block active:bg-[var(--btn-bg-active)] focus:bg-[var(--btn-bg-active)] rounded-full w-[10px] h-[10px] bg-[var(--btn-bg-idle)]"></button>
    `;
    }

    getSlide = ({id, texts, bgImages}) => {
        return `
           <li data-id="${id}" class="yac-carousel-slide relative pt-[48px] pr-6 pb-5 pl-5 flex flex-col basis-full flex-shrink-0 bg-[url('../../assets/common/${bgImages.main}'),url('../../assets/desktop/${bgImages.supplement}')]">
              ${this.getSlots(texts)}
           </li>
        `;
    };

    getSlot = ({id, text}) => {
        return `
            <div class="relative pl-[calc(var(--counter-height)+var(--text-left-offset))] pt-3.5 pb-3.5 before:absolute before:flex before:items-center before:top-4 before:left-0 before:justify-center before:content-['${id}'] before:font-semibold before:text-lg before:leading-[1.2] before:w-9 before:h-9 before:rounded-full before:bg-white">
              <p class="text-left text-lg leading-[1.2] font-medium">${text}</p>
            </div>
          `;
    };

    getSlots = (data) => data.map(item => this.getSlot(item)).join('');

    getSlides = (data) => data.map(item => this.getSlide(item)).join('');

    getDots = (data) => data.map(item => this.getDot(item)).join('');

    moveSlide() {
        const carouselContainer = this.elem.querySelector('.yac-carousel-container');
        const slide = this.elem.querySelector('.yac-carousel-slide');
        const containerGap = parseFloat(window.getComputedStyle(carouselContainer).gap);
        const slideWidth = parseFloat(window.getComputedStyle(slide).width);
        let dist = (-this.counter + 1) * (slideWidth + containerGap);
        carouselContainer.style.transform = `translateX(${dist}px)`;

        this.onSelectBtnClick(slide);
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
        const selectButton = target.closest('.yac-select-btn');
        if (!selectButton) {
            return;
        }
        const slideID = selectButton.dataset.id;
        const event = new CustomEvent('slide-select', {
            bubbles: true,
            detail: slideID,
        });
        this.elem.dispatchEvent(event);
    };

    updateCounter = (id) => this.counter = Number(id)

    addEventListeners() {
        this.elem.addEventListener('pointerdown', ({target}) => {
            const prevBtn = target.closest('.yac-carousel-btn-prev');
            const nextBtn = target.closest('.yac-carousel-btn-next');
            const selectBtn = target.closest('.yac-select-btn');

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

        this.elem.addEventListener('slide-select', ({detail}) => {
            this.updateCounter(detail);
        })

        window.addEventListener('DOMContentLoaded', () => {
            this.updateSelectBox();
        })
    }

}

