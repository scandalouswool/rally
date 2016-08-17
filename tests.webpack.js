var context = require.context('./client/src', true, /-test\.jsx?$/);
context.keys().forEach(context);
