// ============================================
// FILE: src/dataStructures/Trie.js
// ============================================

/**
 * Trie Node for prefix-based search
 */
class TrieNode {
  constructor() {
    this.children = {};
    this.urlIds = [];
  }
}

/**
 * Trie Data Structure for fast prefix search
 * Time Complexity: O(m) for insert and search, where m is word length
 * Space Complexity: O(ALPHABET_SIZE * N * M) where N is number of words
 */
export class Trie {
  constructor() {
    this.root = new TrieNode();
  }

  insert(word, urlId) {
    let node = this.root;
    for (const char of word.toLowerCase()) {
      if (!node.children[char]) {
        node.children[char] = new TrieNode();
      }
      node = node.children[char];
    }
    if (!node.urlIds.includes(urlId)) {
      node.urlIds.push(urlId);
    }
  }

  search(prefix) {
    let node = this.root;
    for (const char of prefix.toLowerCase()) {
      if (!node.children[char]) return [];
      node = node.children[char];
    }
    return this.collectAllIds(node);
  }

  collectAllIds(node) {
    let ids = [...node.urlIds];
    for (const child of Object.values(node.children)) {
      ids = ids.concat(this.collectAllIds(child));
    }
    return [...new Set(ids)];
  }

  remove(word, urlId) {
    this._removeHelper(this.root, word.toLowerCase(), 0, urlId);
  }

  _removeHelper(node, word, index, urlId) {
    if (index === word.length) {
      node.urlIds = node.urlIds.filter(id => id !== urlId);
      return Object.keys(node.children).length === 0 && node.urlIds.length === 0;
    }

    const char = word[index];
    if (!node.children[char]) return false;

    const shouldDeleteChild = this._removeHelper(
      node.children[char],
      word,
      index + 1,
      urlId
    );

    if (shouldDeleteChild) {
      delete node.children[char];
      return Object.keys(node.children).length === 0 && node.urlIds.length === 0;
    }

    return false;
  }
}
