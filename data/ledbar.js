import ws281x from 'rpi-ws281x-native'
import pry from 'pryjs'

const NUM_LEDS = 150
const VIRTUAL_BARS = 15
const BAR_LEN = NUM_LEDS / VIRTUAL_BARS
ws281x.init(NUM_LEDS);
export var ledbar = {arr: Array(NUM_LEDS)};

let animations = {};

export const rgb2Int = ([r, g, b]) => (((r & 0xff) << 16) + ((g & 0xff) << 8) + (b & 0xff));
// eslint-disable-next-line no-mixed-operators
export const Int2rgb = (i) => [i >> 16, i >> 8 & 0xFF, i & 0xFF];

export const decorate = (a) => {
    a.duration = a.delay * a.frames.length
    a.frames = a.frames.map(({ leds })=>leds.map(rgb2Int))
}

export function render() {
ws281x.render(Uint32Array.from(ledbar.arr))
}

function runAnimations(delay){
  const completed = []
  

  Object.entries(animations[delay].animations).forEach(([idx, animation])=>{
    idx = Number(idx)
    if(animation.length === 0){
      completed.push(idx)
    }else{
      const frame = animation.pop()
      ledbar.arr.splice(idx * BAR_LEN, frame.length, ...frame)
    }
  })
  render()
  completed.forEach((idx)=>{
    console.log('idx done', idx)
    delete animations[delay].animations[idx]
  })
  if(Object.keys(animations[delay].animations).length === 0){
    console.log('duration done', delay)
    clearInterval(animations[delay].timer)
    delete animations[delay]
  }
}

export function playAnimation(animation, idx){
  if(!(animation.delay in animations)){
    animations[animation.delay] = {timer: setInterval(runAnimations.bind(null, animation.delay), animation.delay), animations:{}}
  }
  animations[animation.delay].animations[idx] = animation.frames.reverse()
}
