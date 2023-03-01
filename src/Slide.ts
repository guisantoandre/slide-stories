import Timeout from "./Timeout.js";

export default class Slide {
   container;
   slides;
   controls;
   time;
   index: number;
   slide: Element;
   timeout: Timeout | null;
   pausedTimeout: Timeout | null;
   paused: boolean;
   progressItems: HTMLElement[] | null;
   progressActive: HTMLElement | null;
   constructor(
      container: Element,
      slides: Element[],
      controls: Element,
      time: number = 5000
   ) {
      this.container = container;
      this.slides = slides;
      this.controls = controls;
      this.time = time;
      this.index = localStorage.getItem("activeSlide")
         ? Number(localStorage.getItem("activeSlide"))
         : 0;
      this.slide = this.slides[this.index];
      this.timeout = null;
      this.pausedTimeout = null;
      this.paused = false;
      this.progressItems = null;
      this.progressActive = null;

      this.init();
   }

   hide(el: Element) {
      el.classList.remove("active");
      if (el instanceof HTMLVideoElement) {
         el.pause();
         el.currentTime = 0;
         if (el.nextElementSibling instanceof HTMLImageElement) {
            el.nextElementSibling?.remove();
         }
      }
   }
   show(index: number) {
      this.index = index;
      this.slide = this.slides[this.index];
      localStorage.setItem("activeSlide", String(this.index));

      if (this.progressItems) {
         this.progressActive = this.progressItems[this.index];
         this.progressItems.forEach((el) => this.hide(el));
         this.progressActive.classList.add("active");
      }

      this.slides.forEach((el) => this.hide(el));
      this.slide.classList.add("active");
      if (this.slide instanceof HTMLVideoElement) {
         this.autoVideo(this.slide);
         const volumeButton = document.createElement("img");
         volumeButton.className = "sound active";
         volumeButton.src = "./assets/icons/soundon.svg";
         this.slide.insertAdjacentElement("afterend", volumeButton);
      } else {
         this.auto(this.time);
      }
   }
   autoVideo(video: HTMLVideoElement) {
      video.muted = true;
      video.play();
      let firstPlay = true;
      video.addEventListener("playing", () => {
         if (firstPlay) {
            this.auto(video.duration * 1000);
            const soundButton =
               document.querySelector<HTMLImageElement>("img.sound");
            soundButton?.addEventListener("click", () => {
               video.muted ? (video.muted = false) : (video.muted = true);
               soundButton.src.includes("soundon.svg")
                  ? (soundButton.src = "./assets/icons/soundoff.svg")
                  : (soundButton.src = "./assets/icons/soundon.svg");
            });
         }
         firstPlay = false;
      });
   }
   auto(time: number) {
      this.timeout?.clear();
      this.timeout = new Timeout(() => this.next(), time);
      if (this.progressActive)
         this.progressActive.style.animationDuration = `${time}ms`;
   }
   prev() {
      if (this.paused) return;
      const prev = this.index > 0 ? this.index - 1 : this.slides.length - 1;
      this.show(prev);
   }
   next() {
      if (this.paused) return;
      const next = this.index + 1 < this.slides.length ? this.index + 1 : 0;
      this.show(next);
   }
   pause() {
      document.body.classList.add("paused");
      this.pausedTimeout = new Timeout(() => {
         this.timeout?.pause();
         this.paused = true;
         this.progressActive?.classList.add("paused");
         if (this.slide instanceof HTMLVideoElement) this.slide.pause();
      }, 300);
   }
   continue() {
      document.body.classList.remove("paused");
      this.pausedTimeout?.clear();
      if (this.paused) {
         this.paused = false;
         this.timeout?.continue();
         this.progressActive?.classList.remove("paused");
         if (this.slide instanceof HTMLVideoElement) this.slide.play();
      }
   }
   private addControls() {
      const prevButton = document.createElement("button");
      const nextButton = document.createElement("button");
      prevButton.innerText = "Slide anterior";
      nextButton.innerText = "Próximo slide";
      this.controls.appendChild(prevButton);
      this.controls.appendChild(nextButton);

      this.controls.addEventListener("pointerdown", () => this.pause());
      document.addEventListener("pointerup", () => this.continue());
      document.addEventListener("touchend", () => this.continue()); // for mobile devices

      prevButton.addEventListener("pointerup", () => this.prev());
      nextButton.addEventListener("pointerup", () => this.next());
   }
   private addProgressBar() {
      const progressContainer = document.createElement("div");
      progressContainer.id = "progress-bar";
      for (let i = 0; i < this.slides.length; i++) {
         progressContainer.innerHTML += `<span><span class="progress-item"></span></span>`;
      }
      this.controls.appendChild(progressContainer);
      this.progressItems = Array.from(
         document.querySelectorAll(".progress-item")
      );
   }

   private init() {
      this.addControls();
      this.addProgressBar();
      this.show(this.index);
   }
}
