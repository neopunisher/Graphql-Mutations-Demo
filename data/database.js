export class Message {
  constructor(id, text, sentAt, admin) {
    this.id = id
    this.text = text
    this.sentAt = sentAt
    this.admin = admin
  }
}

export class Conversation {
  constructor(id, name) {
    this.id = id
    this.name = name
    this.lastEnteredText = null
  }
}

let nextConversationId: number = 0
let nextMessageId: number = 0

const conversationsById = new Map()
const messagesById = new Map()
const messageIdsByConversationId = new Map()

function getMessageIdsForConversation(id) {
  return messageIdsByConversationId.get(id) || []
}

export function getMessage(id) {
  return messagesById.get(id)
}

export function getConversation(id) {
  return conversationsById.get(id)
}

export function getMessagesByConversationId(conversationId) {
  const messageIds = getMessageIdsForConversation(conversationId)

  return messageIds.map(getMessage)
}

export function getConversations() {
  return [...conversationsById.values()]
}

export function setConversationEnteredText(conversationId, lastEnteredText) {
  const conversation = getConversation(conversationId)

  conversationsById.set(conversation.id, {
    ...conversation,
    lastEnteredText,
  })
}

export function addMessage(conversationId, text, admin = false) {
  const message = new Message(`${nextMessageId++}`, text, new Date(), admin)
  messagesById.set(message.id, message)

  const messageIds = getMessageIdsForConversation(conversationId)
  messageIdsByConversationId.set(conversationId, messageIds.concat(message.id))

  setConversationEnteredText(conversationId, null)

  return message.id
}

export function startConversation(name) {
  const conversation = new Conversation(`${nextConversationId++}`, name)
  conversationsById.set(conversation.id, conversation)
  addMessage(conversation.id, 'Hey! How can I help?', true)

  return conversation.id
}

const exampleConversationId = startConversation('Braden')
addMessage(exampleConversationId, 'Where are my pants?')

const anotherExampleId = startConversation('John')
addMessage(anotherExampleId, 'My computer crashes everytime I open netscape')
