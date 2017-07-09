const socket = io();
let myId;

function scrollToBottom(){
  const messages = jQuery('#messages');
  const newMessage = messages.children('li:last-child');
  const clientHeight = messages.prop('clientHeight');
  const scrollTop = messages.prop('scrollTop');
  const scrollHeight = messages.prop('scrollHeight');
  const newMessageHeight = newMessage.innerHeight();
  const lastMessageHeight = newMessage.prev().innerHeight();

  if(clientHeight + scrollTop + newMessageHeight + lastMessageHeight >= scrollHeight){
    messages.scrollTop(scrollHeight);
  }
};

socket.on('connect', function(){
  const params = jQuery.deparam(window.location.search);

  socket.emit('join', params, function(err){
    if(err){
      alert(err);
      window.location.href = '/';
    }else{
      console.log('No error');
    }
  });
});

socket.on('disconnect', function(){
  console.log('Disconnect to server');
});

socket.on('updateUserList', function(users){
  let ol = jQuery('<ol></ol>');

  users.forEach(function(user){
    ol.append(jQuery('<li></li>').text(user));
  });

  jQuery('#users').html(ol);
});

socket.on('newMessage', function(message, id){
  const formattedTime = moment(message.createdAt).format('h:mm a');
  const template = jQuery('#message-template').html();
  
  const html = Mustache.render(template, {
    text: message.text,
    from: message.from,
    createdAt: formattedTime
  });

  jQuery('#messages').append(html);
  scrollToBottom();
});

socket.on('newSelfMessage', function(message, id){
  const formattedTime = moment(message.createdAt).format('h:mm a');
  const template = jQuery('#message-template-own').html();
  
  const html = Mustache.render(template, {
    text: message.text,
    from: message.from,
    createdAt: formattedTime
  });

  jQuery('#messages').append(html);
  scrollToBottom();
});

socket.on('newLocationMessage', function(message){
  const formattedTime = moment(message.createdAt).format('h:mm a');
  const template = jQuery('#location-message-template').html();
  const html = Mustache.render(template, {
    url: message.url,
    from: message.from,
    createdAt: formattedTime
  });
  
  jQuery('#messages').append(html);
  scrollToBottom();
});

socket.on('newSelfLocationMessage', function(message){
  const formattedTime = moment(message.createdAt).format('h:mm a');
  const template = jQuery('#location-message-template-self').html();
  const html = Mustache.render(template, {
    url: message.url,
    from: message.from,
    createdAt: formattedTime
  });
  
  jQuery('#messages').append(html);
  scrollToBottom();
});

jQuery('#message-form').on('submit', function(e){
  e.preventDefault();
  let messageTextbox = jQuery('[name=message]');
  socket.emit('createMessage', {
    from: 'User',
    text: messageTextbox.val()
  }, function(){
    messageTextbox.val('');
  });
});

const locationButton = jQuery('#send-location');
locationButton.on('click', function(){
  if(!navigator.geolocation){
    return alert('Geolocation not supported by your browser');
  }

  locationButton.attr('disabled', 'disabled').text('Sending Location');

  navigator.geolocation.getCurrentPosition(function(position){
    locationButton.removeAttr('disabled').text('Send Location');
    socket.emit('createLocationMessage', {
      latitude: position.coords.latitude,
      longitude: position.coords.longitude
    });
  }, function(){
    locationButton.removeAttr('disabled').text('Send Location');
    alert('Unable to fetch location');
  });
});