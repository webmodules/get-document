
var assert = require('assert');
var getDocument = require('../');

describe('get-document', function () {

  it('should work with a Window object', function () {
    var doc = getDocument(window);
    assert(doc === document);
  });

  it('should work with a Document object', function () {
    var doc = getDocument(document);
    assert(doc === document);
  });

  it('should work with a <body> element', function () {
    var doc = getDocument(document.body);
    assert(doc === document);
  });

  it('should work with a node inside the DOM', function () {
    var doc = getDocument(document.body.firstChild);
    assert(doc === document);
  });

  it('should work with a new DOM element', function () {
    var doc = getDocument(document.createElement('div'));
    assert(doc === document);
  });

  it('should work with a TextNode instance', function () {
    var doc = getDocument(document.createTextNode(''));
    assert(doc === document);
  });

  // skip on IE <= 8
  if ('function' === typeof document.createRange) {
    it('should work with a Range instance', function () {
      var doc = getDocument(document.createRange());
      assert(doc === document);
    });
  }

  // skip on IE <= 8
  if ('function' === typeof window.getSelection) {
    it('should work with a Selection instance', function () {
      // NOTE: a Selection needs to have some kind of selection on it
      // (i.e. not `type: "None"`) in order for a Document to be found
      var range = document.createRange();
      var t = document.createTextNode('t');
      document.body.appendChild(t);
      range.setStart(t, 0);
      range.setEnd(t, t.nodeValue.length);

      var sel = window.getSelection();
      sel.removeAllRanges();
      sel.addRange(range);
      assert.equal(1, sel.rangeCount);

      var doc = getDocument(sel);
      assert(doc === document);

      // clean up
      sel.removeAllRanges();
    });
  }

  it('should work with the child node of an IFRAME element', function () {
    var iframe = document.createElement('iframe');
    document.body.appendChild(iframe);

    // `contentWindow` should be used for best browser compatibility
    var doc = getDocument(iframe.contentWindow);
    assert.equal(9, doc.nodeType);

    doc.open();
    doc.write('<body><b>hello world</b></body>');
    doc.close();

    // test the <body>
    var body = doc.body;
    assert(doc === getDocument(body));

    // test the <b> node
    assert(doc === getDocument(body.firstChild));

    // clean up
    document.body.removeChild(iframe);
  });

});
