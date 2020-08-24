// Throughout this script there will be places marked as [MUST CHANGE]. Make sure you fill in the details accordingly.
// Other places have comments to inform you what kind of customizations you can potentially make there. Make sure you
// read through them.

// jQuery is not required anymore for this extension
var utils = optimizely.get('utils');
var recommender = optimizely.get('recommender');

// This boolean tells whether you are in the editor, so that you can special case if needed.
var editorMode = !!window.optimizely_p13n_inner ||
    window.location != window.parent.location &&
    window.location.search.indexOf('optimizely_editor') > -1,
    logEnabled = editorMode || window.localStorage.getItem('logRecs');

var log = function() {
  if(logEnabled) console.log.apply(console, arguments);
};


// Fill in the real ids of the different recommenders you will use
var recommenderIds = {
    "co-browse": 0,
    "co-buy": 0,
    "popular": 18242292367,
    "user-based": 0
};
var recommenderKey = {
    recommenderServiceId: 18253330615,
    recommenderId: 18242292367
};

// Replace with the actual id tag name of the recommender service.
var idTagName = 'primary_id';

function preFilter(reco) {
  // Use this function to filter on these fields:
  // * id (keyed by idTagName)
  // * _score (usually a value between 0 and 1)
  return true;
}

function canonicalize(reco) {
  log('canonicalize', reco);

  // This is where you perform any necessary canonicalization of the recos before rendering them.
  // In the example below, we convert numeric prices into string form, and treat missing in_stock values as true.
  if (typeof reco.price === 'number') {
    // [MUST CHANGE] if this is for a different currency and/or locale.
    var symbol = '$';
    var locale = 'en-US';
    reco.price = symbol + (reco.price / 100.0).toLocaleString(
      locale, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  }
  if (typeof reco.in_stock === 'undefined') {
    reco.in_stock = true;
  }

  return reco;
}

function postFilter(reco) {
  // Use this function to filter on other metadata fields not covered in preFilter().
  // In this example, we exclude out of stock or recos with missing metadata.
  return reco.product_name &&
   // reco.price &&
    reco.primary_id &&
    reco.product_url &&
    reco.product_image;
}

function fetchRecos(targetId) {
  /*if (editorMode && extension.example_json.trim()) {
    log('Using example reco, because it is editormode');

    var recos = [];
    //for (var i = 0; i < 20; i++) {
      recos.push(JSON.parse(extension.example_json.trim()));
    //}
    recos = recos[0];
    log(recos);
    return recos;
  } else {*/
    log('else part of fetcher function 1');
    var fetcher = recommender.getRecommendationsFetcher(recommenderKey, targetId, {
      preFilter: preFilter,
      canonicalize: canonicalize,
      postFilter: postFilter
    });
    log('else part of fetcher function 2');
    log(fetcher);
    return fetcher.next(extension.max);
 // }
}

function renderRecos(recos) {
  recos = recos.slice(0, extension.max);
  if (recos.length === 0) {
    // using example reco if there are no recos yet
    log('Using example reco from render function');
    recos.push(JSON.parse(extension.example_json.trim()));
    //log("recos is: " + recos);
    //log(recos[0]);
    recos = recos[0];
    log(recos);
  }
}

var fetcher = recommender.getRecommendationsFetcher(recommenderKey, 'popular', {
      preFilter: preFilter,
      canonicalize: canonicalize,
      postFilter: postFilter
    });

    console.log('else part of fetcher function 2');
    console.log(fetcher);
