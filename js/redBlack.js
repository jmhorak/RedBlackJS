//////////////////////////////////////////////////////////////////////////
// File: redBlack.js
//
// Description: 
//   
//
// Related File(s):
//
// External Link(s):
//
// Copyright: 
//   Copyright (c) 1996-2012 Seapine Software, Inc.
//   All contents of this file are considered Seapine Software proprietary.
//////////////////////////////////////////////////////////////////////////

RBTree = (function() {
  var paper = null, // Drawing canvas
      root = null, // Root node
      hs = 30, // Horizontal spacing at the leaf
      vs = 30, // Vertical spacing at the leaf
      bs = 30, // Branch spacing at the leaf
      r = 25, // Node radius
      hgt = 0, // Tree height
      cw = 750, // Container width
      ch = 750, // Container height
      mg = 30; // Top margin

  function adjust(item, itemHgt) {
    if (root === item) return item.attr('cx');

    var xPt = adjust(item.data('parent'), itemHgt - 1);

      // Is left or right child
    xPt = xPt + (item === item.data('parent').data('left') ? -1 : 1)*
        (2*r + (hs/2) + (bs)/2)*(Math.pow(2, hgt-itemHgt));

    item.attr({cx: xPt});
    item.data('text').attr({x: xPt});
    item.data('edge').attr({path: 'M' + xPt + ' ' + item.attr('cy') + 'L' +
        item.data('parent').attr('cx') + ' ' + item.data('parent').attr('cy')});

    return xPt;
  };

  return {
     init: function() {
       paper = new Raphael('displayContainer', 750, 750);
     },

    addNode: function(key) {
      console.log('Adding ' + key);

      var xPt, yPt, node, parent, parentBox, isLeft, insertHgt;

      if (root === null) {
        // Root is null, this is the new root node
        xPt = cw/2;
        yPt = mg + r/2;

        root = paper.circle(xPt, yPt, r)
                    .data('key', key)
                    .data('left', null)
                    .data('right', null)
                    .data('parent', null)
                    .data('isRed', false)
                    .attr({fill: 'black'});
        root.data("text", paper.text(xPt, yPt, key.toString()).attr({fill: 'white'}))
            .data('edge', null);
        hgt = 1;
        
      } else {
        node = root;
        insertHgt = 0;
        isLeft = false;
        while (node !== null) {
          insertHgt++;
          parent = node;
          if (node.data('key') < key) {
            // Go right
            isLeft = false;
            node = node.data('right');
          } else {
            // Go left
            isLeft = true;
            node = node.data('left');
          }
        }

        if (insertHgt > hgt) hgt = insertHgt;

        adjust(parent, insertHgt);

        parentBox = parent.getBBox();

        if (isLeft) {
          xPt = parentBox.x - hs - r;
        } else {
          xPt = parentBox.x + parentBox.width + hs + r;
        }

        yPt = parentBox.y + parentBox.height + vs + r;

        node = paper.circle(xPt, yPt, r)
                    .data('key', key)
                    .data('left', null)
                    .data('right', null)
                    .data('parent', parent)
                    .data('isRed', true)
                    .data('text', paper.text(xPt, yPt, key.toString()))
                    .data('edge', paper.path('M' + xPt + ' ' + yPt + 'L' + parent.attr('cx') + ' ' +
                                              parent.attr('cy')).toBack())
                    .attr({fill: 'red'});

        parent.data(isLeft ? 'left' : 'right', node);
      }
    },

    removeNode: function(key) {
      console.log('Removing ' + key);
    },

    findNode: function(key) {
      console.log('Finding ' + key);
    },

    fetchNodeAt: function(index) {
      console.log('Fetching node at ' + index);
    }
   };
})();

$(document).ready(function() {
  $('#addBtn').click(function() {
    var key = parseInt($('#key').val(), 10);
    if (!isNaN(key)) {
      RBTree.addNode(key);
    }
  });

  $('#removeBtn').click(function() {
    var key = parseInt($('#key').val(), 10);
    if (!isNaN(key)) {
      RBTree.removeNode(key);
    }
  });

  $('#fetchBtn').click(function() {
    var index = parseInt($('#key').val(), 10);
    if (!isNaN(index)) {
      RBTree.fetchNodeAt(index);
    }
  });

  $('#findBtn').click(function() {
    var key = parseInt($('#key').val(), 10);
    if (!isNaN(key)) {
      RBTree.findNode(key);
    }
  });

  RBTree.init();
});