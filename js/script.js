'use strict';

const optArticleSelector = '.post',
  optTitleSelector = '.post-title',
  optTitleListSelector = '.titles',
  optArticleTagsSelector = '.post-tags .list',
  optActiveLinkSelector = 'a.active',
  optArticleAuthorSelector = '.post-author',
  optAuthorsListSelector = '.authors',
  optCloudClassCount = 5,
  optCloudClassPrefix = 'tag-size-';

function titleClickHandler(event){
  event.preventDefault();
  const clickedElement = this;
  const activeLinks = document.querySelectorAll('.titles a.active');
  for(let activeLink of activeLinks){
    activeLink.classList.remove('active');
  }
  clickedElement.classList.add('active');
  const activeArticles = document.querySelectorAll('.posts article.active');
  for(let activeArticle of activeArticles){
    activeArticle.classList.remove('active');
  }
  const href = clickedElement.getAttribute('href');
  const article = document.querySelector(href);
  article.classList.add('active');
}

function generateTitleLinks(customSelector = ''){
  const titleList = document.querySelector(optTitleListSelector);
  titleList.innerHTML = '';
  const articles = document.querySelectorAll(optArticleSelector + customSelector);
  let html = '';
  for(let article of articles){
    const articleId = article.getAttribute('id');
    const articleTitle = article.querySelector(optTitleSelector).innerHTML;
    const linkHTML = '<li><a href="#' + articleId + '"><span>' + articleTitle + '</span></a></li>';
    html = html + linkHTML;
  }
  titleList.innerHTML = html;

  /* Event listener */
  const links = document.querySelectorAll('.titles a');
  for(let link of links){
    link.addEventListener('click', titleClickHandler);
  }
}
generateTitleLinks();

function calculateTagsParams(allTags){
  const params = {};
  let min = 999999,
    max = 0;
  for (let tag in allTags) {
    const tagCount = allTags[tag];
    min = Math.min(min, tagCount);
    max = Math.max(max, tagCount);
  }
  params.min = min;
  params.max = max;
  return params;
}

function calculateTagClass(count, params){
  const normalizedCount = count - params.min;
  const normalizedMax = params.max - params.min;
  const percentage = normalizedCount / normalizedMax;
  const classNumber = Math.floor(percentage * (optCloudClassCount - 1) + 1);
  const tagCloudClass = optCloudClassPrefix + classNumber;
  return tagCloudClass;
}

function generateTags(){
  let allTags = {};
  const articles = document.querySelectorAll(optArticleSelector);
  for (let article of articles) {
    const tagWrapper = article.querySelector(optArticleTagsSelector);
    let html = '';
    const articleTags = article.getAttribute('data-tags');
    const articleTagsArray = articleTags.split(' ');
    for (let tag of articleTagsArray) {
      const linkHTML = '<li><a href="#tag-' + tag + '">' + tag + '</a></li> ';
      html = html + linkHTML;
      // eslint-disable-next-line no-prototype-builtins
      if (!allTags.hasOwnProperty(tag)) {
        allTags[tag] = 1;
      } else {
        allTags[tag]++;
      }
    }
    tagWrapper.innerHTML = html;
  }
  const tagList = document.querySelector('.tags');
  const tagsParams = calculateTagsParams(allTags);
  let allTagsHTML = '';
  for (let tag in allTags) {
    const tagLinkHTML = calculateTagClass(allTags[tag], tagsParams);
    allTagsHTML += '<li><a class="' + tagLinkHTML + '" href="#tag-' + tag + '">' + tag + ' (' + allTags[tag] + ')</a></li> \xa0' ;
  }
  tagList.innerHTML = allTagsHTML;
  const tags = document.querySelectorAll('.tags a');
  for (let tag of tags) {
    tag.addEventListener('click', tagClickHandler);
  }
}
generateTags();

function tagClickHandler(event){
  event.preventDefault();
  const clickedElement = this;
  const href = clickedElement.getAttribute('href');
  const tag = href.replace('#tag-', '');
  const activeTags = document.querySelectorAll(optActiveLinkSelector);
  for (let activeTag of activeTags) {
    activeTag.classList.remove('active');
  }
  const tagLinks = document.querySelectorAll('a[href="' + href + '"]');
  for (let tagLink of tagLinks) {
    tagLink.classList.add('active');
  }
  generateTitleLinks('[data-tags~="' + tag + '"]');
}

function addClickListenersToTags(){
  const tags = document.querySelectorAll('.post-tags .list a');
  for (let tag of tags) {
    tag.addEventListener('click', tagClickHandler);
  }
}
addClickListenersToTags();

function generateAuthors(){
  let allAuthorNames = {};
  let html = '';
  const articles = document.querySelectorAll(optArticleSelector);
  for (let article of articles) {
    const authorWrapper = article.querySelector(optArticleAuthorSelector);
    const authorName = article.getAttribute('data-author');
    // eslint-disable-next-line no-prototype-builtins
    if (!allAuthorNames.hasOwnProperty(authorName)) {
      allAuthorNames[authorName] = 1;
    } else {
      allAuthorNames[authorName]++;
    }
    const postAuthor = 'by ' + authorName;
    authorWrapper.innerHTML = postAuthor;
  }
  const authorList = document.querySelector(optAuthorsListSelector);
  for (let authorName in allAuthorNames) {
    html = html + '<li><a href="#"><span class="author-name">' + authorName + '</span> (' + allAuthorNames[authorName] + ')</a></li>';
  }
  authorList.innerHTML = html;
}
generateAuthors();

function authorClickHandler(event) {
  event.preventDefault();
  const clickedElement = this;
  const authorName = clickedElement.querySelector('.author-name').innerHTML;
  const activeAuthors = document.querySelectorAll(optActiveLinkSelector);
  for (let activeAuthor of activeAuthors) {
    activeAuthor.classList.remove('active');
  }
  clickedElement.classList.add('active');
  generateTitleLinks('[data-author="' + authorName + '"');
}

function addClickListenersToAuthors(){
  const authors = document.querySelectorAll('.authors a');
  for (let author of authors) {
    author.addEventListener('click', authorClickHandler);
  }
}
addClickListenersToAuthors();

function clearFiltersClickHandler(event){
  event.preventDefault();
  const clearLinks = document.querySelectorAll(optActiveLinkSelector);
  for (let clearLink of clearLinks) {
    clearLink.classList.remove('active');
  }
  generateTitleLinks();
}

function addClickListenerToClear(){
  const clear = document.querySelector('.clear a');
  clear.addEventListener('click', clearFiltersClickHandler);
}
addClickListenerToClear();