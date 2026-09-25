using CourseTracker.Api.Data;
using CourseTracker.Api.Endpoints;

var builder = WebApplication.CreateBuilder(args);

// In-memory data store, shared as a singleton for the life of the app.
builder.Services.AddSingleton<CourseStore>();

// Allow the React dev server (Vite) to call the API during development.
builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(policy =>
        policy.WithOrigins("http://localhost:5173")
              .AllowAnyHeader()
              .AllowAnyMethod());
});

var app = builder.Build();

app.UseCors();

app.MapCourseEndpoints();

app.Run();
