export const openingScript = [
  {
    type: 'dialogue',
    speaker: 'Marigold',
    portrait: 'neutral',
    text: "Oh my! You're finally here."
  },
  {
    type: 'pause',
    ms: 600
  },
  {
    type: 'dialogue',
    speaker: 'Marigold',
    portrait: 'neutral',
    text: "I've been watching that little house sit quiet for months now. We all have, really. The whole village kept wondering who'd come along and fill it with life again."
  },
  {
    type: 'dialogue',
    speaker: 'Marigold',
    portrait: 'neutral',
    text: 'Well — here you are.'
  },
  {
    type: 'dialogue',
    speaker: 'Marigold',
    portrait: 'smiling',
    text: "I'm Marigold. I live just down the path, past the stone wall with all the moss on it. You can't miss it — I have far too many wind chimes."
  },
  {
    type: 'dialogue',
    speaker: 'Marigold',
    portrait: 'neutral',
    text: 'And you are...?'
  },
  {
    type: 'nameInput',
    placeholder: 'introduce yourself...',
    saveAs: 'playerName'
  },
  {
    type: 'dialogue',
    speaker: 'Marigold',
    portrait: 'smiling',
    text: '{{playerName}}.',
    note: 'She repeats the name warmly. A short beat before the next line.'
  },
  {
    type: 'pause',
    ms: 800
  },
  {
    type: 'dialogue',
    speaker: 'Marigold',
    portrait: 'smiling',
    text: "What a lovely name. It suits someone who'd choose a house with a cherry blossom tree in the garden, I think."
  },
  {
    type: 'dialogue',
    speaker: 'Marigold',
    portrait: 'smiling',
    text: 'Well, {{playerName}} — welcome to Hanami Village.'
  },
  {
    type: 'dialogue',
    speaker: 'Marigold',
    portrait: 'neutral',
    text: "That's what we've always called it, anyway. Though I suppose it's your home now too — you can call it whatever feels right."
  },
  {
    type: 'townInput',
    placeholder: 'Hanami Village',
    suggestion: 'Hanami Village',
    saveAs: 'townName',
    confirmLabel: 'keep this name',
    changeLabel: 'give it your own name'
  },
  {
    type: 'dialogue',
    speaker: 'Marigold',
    portrait: 'smiling',
    text: '{{townName}} it is, then.'
  },
  {
    type: 'dialogue',
    speaker: 'Marigold',
    portrait: 'neutral',
    text: "We're small. Quiet, mostly. The kind of place where everyone knows when the bakery runs out of the good rolls."
  },
  {
    type: 'dialogue',
    speaker: 'Marigold',
    portrait: 'neutral',
    text: "I hope you'll be happy here. I have a feeling you will be."
  },
  {
    type: 'pause',
    ms: 500
  },
  {
    type: 'dialogue',
    speaker: 'Marigold',
    portrait: 'neutral',
    text: 'Oh — one more thing.'
  },
  {
    type: 'pause',
    ms: 600
  },
  {
    type: 'dialogue',
    speaker: 'Marigold',
    portrait: 'smiling',
    text: "Keep your eyes open on your walks, would you? This village has a way of... needing things. Little things. You'll see what I mean."
  },
  {
    type: 'dialogue',
    speaker: null,
    portrait: null,
    text: 'She waves and disappears around the stone wall.',
    style: 'narration'
  },
  {
    type: 'dialogue',
    speaker: null,
    portrait: null,
    text: 'The house sits quiet again. A blossom lands on the porch rail.',
    style: 'narration'
  },
  {
    type: 'dialogue',
    speaker: null,
    portrait: null,
    text: "Something rustles in the garden below — but when you look, there's nothing there.",
    style: 'narration'
  },
  {
    type: 'end'
  }
];
