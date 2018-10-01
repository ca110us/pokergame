var word = ['1','2','3','5','8','10','A']; 
var obj = {2:0,3:1,4:2,5:3,6:4,7:5,8:6,9:7,10:8,'J':9,'Q':10,'K':11,'A':12,'￥':13,'$':14}; 
var obj1 = {0:2,1:3,2:4,3:5,4:6,5:7,6:8,7:9,8:10,9:'J',10:'Q',11:'K',12:'A',13:'￥',14:'$'}; 
for(var index in word){ 
var word1 = word[index]; 
var word3 = ""; 
for(var i = 0; i< word1.length; i ++ ){ 
word3 += obj[word1[i]]; 
}; 
word[index] = word3 
} 
word.sort(); 
for(var index in word){ 
var word1 = word[index]; 
var word3 = ""; 
for(var i = 0; i< word1.length; i ++ ){ 
word3 += obj1[word1[i]]; 
}; 
word[index] = word3 
} 
console.log(word); 