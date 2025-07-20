// 中文练习文本
export const chineseTexts = [
  "春天来了，樱花盛开，微风轻拂过脸庞。小鸟在枝头歌唱，阳光透过树叶洒在地面上，形成斑驳的光影。这是一个充满希望的季节，万物复苏，生机勃勃。",
  "在这个数字化的时代，我们每天都在与键盘打交道。熟练的打字技能不仅能提高工作效率，还能让我们更好地表达自己的想法。通过不断的练习，我们可以达到盲打的水平。",
  "月亮高高挂在夜空中，星星眨着眼睛。远山如黛，近水如镜。夜晚的宁静让人心旷神怡，仿佛整个世界都沉浸在这份安详之中。这样的夜晚，最适合静下心来思考人生。",
  "学习是一个持续的过程，需要我们保持好奇心和求知欲。每一次的练习都是在为未来的成功打基础。不要害怕犯错，因为错误是学习过程中不可避免的一部分。",
  "科技的发展改变了我们的生活方式。从古老的书信到现代的即时通讯，从马车到高铁，从算盘到计算机。每一次技术革新都推动着人类文明向前发展。"
]

// 英文练习文本
export const englishTexts = [
  "The quick brown fox jumps over the lazy dog. This sentence contains every letter of the alphabet and is commonly used for typing practice. It helps improve both speed and accuracy.",
  "Technology has revolutionized the way we communicate and work. From typewriters to modern keyboards, the art of typing has evolved significantly. Practice makes perfect in developing muscle memory.",
  "In the digital age, typing skills are essential for productivity. Whether you're writing emails, coding, or creating documents, fast and accurate typing can save you countless hours throughout your career.",
  "Learning to type without looking at the keyboard is called touch typing. This skill allows you to focus on your thoughts rather than hunting for keys. With consistent practice, anyone can master this technique.",
  "The beauty of nature inspires us every day. From the gentle rustling of leaves to the powerful crash of ocean waves, our world is filled with wonder. Take time to appreciate the simple things in life."
]

// 代码练习文本
export const codeTexts = [
  "function calculateSum(a, b) { return a + b; } const result = calculateSum(10, 20); console.log(result);",
  "import React from 'react'; const App = () => { return <div>Hello World</div>; }; export default App;",
  "for (let i = 0; i < array.length; i++) { if (array[i] === target) { return i; } } return -1;",
  "const fetchData = async () => { try { const response = await fetch('/api/data'); return response.json(); } catch (error) { console.error(error); } };",
  "class Rectangle { constructor(width, height) { this.width = width; this.height = height; } getArea() { return this.width * this.height; } }"
]

// 获取随机文本
export const getRandomText = (mode) => {
  switch (mode) {
    case 'chinese':
      return chineseTexts[Math.floor(Math.random() * chineseTexts.length)]
    case 'english':
      return englishTexts[Math.floor(Math.random() * englishTexts.length)]
    case 'code':
      return codeTexts[Math.floor(Math.random() * codeTexts.length)]
    default:
      return chineseTexts[0]
  }
}