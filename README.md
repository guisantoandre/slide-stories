# Instagram Slide Stories Clone

Instagram slide stories clone made with typescript

- This was made with typescript, but you have access to all vanilla javascript compiled code on `dist folder`, feel free to use on your project. Instructions below

`You can pause slides, mute and turn on the sound on the videos slides`

![ezgif com-video-to-gif11](https://user-images.githubusercontent.com/35943439/222225934-905ea513-5471-4482-940c-8a346e40606f.gif)

1. The HTML structure (the ids MUST be the same of the code below): <br>
  ```
  <div id="slide">
    <div id="slide-elements">
      <!-- All the images and videos need to be inside slide-elements div, right below -->
      <img src="./assets/img1.jpg" alt="Fox">
      <img src="./assets/img2.jpg" alt="Dog">
      <img src="./assets/img3.jpg" alt="Cat">
      <video playsinline src="./assets/vid01.mp4"></video>
      <video playsinline src="./assets/vid02.mp4"></video>
    </div>
    <div id="slide-controls"></div>
  </div>
  ```

2. Then insert this code before the closing body tag: `<script type="module" src="./dist/script.js"></script>`

3. Make sure to start the `index.html` with Live Server extension, and that's it!
