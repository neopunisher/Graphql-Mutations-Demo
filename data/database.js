
import {
  decorate
} from './ledbar'

const uuid = require('uuid/v4');
const asyncRedis = require("async-redis");
const client = asyncRedis.createClient();

client.on("error", function (err) {
    console.log("Error " + err);
});

export class Animation {
  constructor(id, name, frames, delay = 100) {
    this.id = id
    this.name = name
    this.delay = delay
    this.frames = frames
    decorate(this)
  }
}
export class Message {
  constructor(id, text) {
    this.id = id
    this.text = text
  }
}
export class AnimationSequence {
  constructor(id, name, animations) {
    this.id = id
    this.name = name
    this.animations = animations
  }
}
export class AnimationFrame {
  constructor(leds, index) {
    this.leds = leds
    this.index = index
  }
}

export class LedBar {
  constructor({id, password, index, numLeds}){
    this.id = id
    this.numLeds = numLeds
    this.index = index
    this.secret = password
  }
}

async function getAnimationFramesForAnimation(id) {
  const frames = await client.lrange(`animationFrames:${id}`, 0, -1)
  return frames.map((leds, idx) => new AnimationFrame(JSON.parse(leds), idx))
}

async function getAnimationsForAnimationSequence(id) {
  const animations = await client.lrange(`animationSequenceAnimations:${id}`, 0, -1)
  return await Promise.all(animations.map(getAnimation))
}

export async function getAnimation(id) {
  const frames = await getAnimationFramesForAnimation(id)
  const animation = await client.hgetall(`animation:${id}`)
  return new Animation(animation.id, animation.name, frames, animation.delay)
}

export async function getLedBar(id) {
  const ledbar = await client.hgetall(`ledbar:${id}`)
  return new LedBar(ledbar)
}

export async function getMessage(id) {
  const message = await client.hgetall(`message:${id}`)
  return new Animation(message.id, message.text)
}

export async function getAnimationName(id) {
  return await client.hget(`animation:${id}`, 'name')
}

export async function getMessageText(id) {
  return await client.hget(`message:${id}`, 'text')
}

export async function getAnimationSequenceName(id) {
  return await client.hget(`animationSequence:${id}`, 'name')
}

export async function getAnimationSequence(id) {
  const animations = await getAnimationsForAnimationSequence(id)
  const animationSequence = await client.hgetall(`animationSequence:${id}`)
  return new AnimationSequence(animationSequence.id, animationSequence.name, animations)
}

export async function getAnimations() {
  const animations = await client.smembers(`animations`)
  return await Promise.all(animations.map(getAnimation))
}

export async function getAnimationSequences() {
  return await Promise.all(await client.smembers(`animationSequences`).map(getAnimationSequence))
}

export async function getLedBars() {
  const ledbarIds = await client.smembers(`ledbars`)
  return await Promise.all(ledbarIds.map(getLedBar))
}

export async function addAnimation(name, delay = 100) {
  const animation = new Animation(uuid(), name, [], delay)
  const hash = {id: animation.id, name: animation.name, delay: animation.delay}
  let cmds = Object.entries(hash).map(([key, val])=>client.hset(`animation:${animation.id}`, key, val))
  cmds.push(client.sadd(`animations`, animation.id))
  await Promise.all(cmds)
  return animation
}
export async function addAnimationFrame(id, leds) {
  const created_at_idx = await client.rpush(`animationFrames:${id}`, JSON.stringify(leds))
  const frame = new AnimationFrame(leds, created_at_idx)
  return frame
}
export async function addAnimationSequence(name, animation_ids) {
  const animationSequence = new AnimationSequence(uuid(), name, await Promise.all(animation_ids.map(getAnimation)))
  let cmds = Object.entries({id: animationSequence.id, name: animationSequence.name}).map(([key, val])=>client.hset(`animationSequence:${animationSequence.id}`, key, val))
  cmds.push(client.sadd(`animationSequences`, animationSequence.id))
  cmds.push(client.rpush(`animationSequenceAnimations:${animationSequence.id}`, ...animation_ids))
  await Promise.all(cmds)
  return animationSequence
}
