getLastDigit = (t) => {
  return parseInt(t.toString().slice(-1));
};

getFirstDigits = (t) => {
  return parseInt(t.toString().slice(0, -1));
};

isMultipleOf5 = (t) => {
  return [0, 5].reduce((res, curr) => {
    return (res = res || curr === getLastDigit(t));
  }, false);
};

isBetween0and5 = (t) => {
  const _t = getLastDigit(t);
  return _t < 5;
};

isBetween5and9 = (t) => {
  const _t = getLastDigit(t);
  return (_t) => 5 && _t <= 9;
};

appendDigit = (t, d) => {
  return parseInt(getFirstDigits(t).toString() + d.toString());
};

getLeft = (t) => {
  if (t >= 10) {
    if (isBetween0and5(t)) return appendDigit(t, 0);
    else return appendDigit(t, 5);
  } else {
    if (t < 5) return 0;
    else return 5;
  }
};

getSecondRightMostDigit = (t) => {
  return parseInt(t.toString().slice(-2, -1));
};

incrementSecondDigit = (t) => {
  return t + 10;
};

getRight = (t) => {
  if (t < 5) return 5;
  else if (t < 10) return 10;
  else if (isBetween0and5(t)) return appendDigit(t, 5);
  else return appendDigit(incrementSecondDigit(t), 0);
};

function range(c, m) {
  var current = c || 1,
    last = m,
    delta = 2,
    left = getLeft(c),
    right = getRight(c),
    range = [],
    rangeWithEllipsis = [],
    l,
    t;

  var rightBoundary = right < 5 ? 5 : right;
  for (var i = left; i < rightBoundary; ++i) {
    if (i < m && i > 0) range.push(i);
  }
  range.push(m);

  for (var i of range) {
    if (l) {
      if (i - l === 2) {
        t = l + 1;
        rangeWithEllipsis.push(t);
      } else if (i - l !== 1) {
        rangeWithEllipsis.push("...");
      }
    }
    rangeWithEllipsis.push(i);
    l = i;
  }
  return rangeWithEllipsis;
}
