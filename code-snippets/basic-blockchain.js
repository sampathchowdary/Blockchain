const crypto = require('crypto')

// ===== Single Block ============
class Block {
  constructor(index, timestamp, data, previousHash = ''){
    this.index=index;
    this.timestamp = timestamp;
    this.data = data;
    this.previousHash=previousHash;
    this.nonce = 0;
    this.hash = this.calculateHash();
  }
  //
  calculateHash() {
    const blockString = this.index + this.previousHash + this.timestamp + JSON.stringify(this.data) + this.nonce;
    return crypto.createHash('sha256').update(blockString).digest('hex');
  }
  
  mineBlock(difficulty){
    while(this.hash.substring(0, difficulty) !== Array(difficulty + 1).join('0')){
      this.nonce++;
      this.hash = this.calculateHash();
    }
    console.log('Block mined : ', this.hash);
  }
}

  // ====== Blockchain ==============
class Blockchain {
  constructor() {
    this.chain = [this.createFirstBlock()];
    this.difficulty = 2;
  }
  
  createFirstBlock() {
    return new Block(0, Date.now().toString(), 'Hey Sam this is your 0 block', 0);
  }
  
  getLastBlock(){
    return this.chain[this.chain.length - 1];
  }
  
  addBlock(newBlock){
    newBlock.previousHash = this.getLastBlock().hash;
    newBlock.mineBlock(this.difficulty);
    this.chain.push(newBlock);  
  }
  
  
  isChainValid() {
    for(let i=1;i<this.chain.length;i++){
      const current = this.chain[i];
      const previous = this.chain[i-1];
      if(current.hash !== current.calculateHash()) return false;
      if(current.previousHash !== previous.hash) return false;
    }
    return true;
  }
  
}

// ===== main class ===============

const blockChain = new Blockchain();
console.log('start mining 1')
const block1 = new Block(1, Date.now().toString(), 'hey this first block')
blockChain.addBlock(block1);
console.log('start mining 2')
blockChain.addBlock(new Block(2, Date.now().toString(), 'hey this second block'));

console.log(blockChain.chain)
console.log('check blockchain validity ?', blockChain.isChainValid());