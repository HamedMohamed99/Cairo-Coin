function load_plan() {
  const elements = ['#home', '#keys', '#usage', '#plan', '#docs', '#reload'];
  elements.forEach(element => {
    document.querySelector(element).style.display = element === '#plan' ? 'block' : 'none';
  });

  document.querySelector('#header_data').style.display = 'flex';

  document.getElementById('plan').innerHTML= `
  <div class="main-plan pt-5">
    <div class="plan">
      <span class="label-plan"></span>
      <div class="inner">
        <span class="pricing">
          <span>
            Free
          </span>
        </span>
        <p class="title">Regular</p>
        <p class="info-plan">This plan is for personal use.</p>
        <ul class="features">
          <li>
            <span class="icon">
              <svg height="24" width="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M0 0h24v24H0z" fill="none"></path>
                <path fill="currentColor" d="M10 15.172l9.192-9.193 1.415 1.414L10 18l-6.364-6.364 1.414-1.414z"></path>
              </svg>
            </span>
            <span><strong>3</strong> API Keys</span>
          </li>
          <li>
            <span class="icon">
              <svg height="24" width="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M0 0h24v24H0z" fill="none"></path>
                <path fill="currentColor" d="M10 15.172l9.192-9.193 1.415 1.414L10 18l-6.364-6.364 1.414-1.414z"></path>
              </svg>
            </span>
            <span><strong>100 Token</strong> / day</span>
          </li>
          <li>
            <span class="icon">
              <svg height="24" width="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M0 0h24v24H0z" fill="none"></path>
                <path fill="currentColor" d="M10 15.172l9.192-9.193 1.415 1.414L10 18l-6.364-6.364 1.414-1.414z"></path>
              </svg>
            </span>
            <span>Access to all end points</span>
          </li>
        </ul>
      </div>
    </div>

    <div class="pt-5">
      <div class="plan">
        <div class="inner" style="padding-top:10px; padding:10px;">
          <div class="note-plan">
            In case you need to upgrade your plan academic purposes only, kindly send us an mail from the registered email with the details. |
            <strong>Cairo.Coin.Plus@Gmail.com<strong>
          </div>
        </div>
      </div>
    </div>
  </div>
  `;
}

// export default load_plan;