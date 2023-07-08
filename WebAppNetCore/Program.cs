
using Amazon.Runtime.Documents;
using Amazon.Runtime.Internal;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Options;
using MongoDB.Driver;
using MongoDB.Driver.Core.Configuration;
using System.Reflection.Metadata;
using System.Runtime.CompilerServices;
using WebAppNetCore;
using WebAppNetCore.wwwroot;
using WebAppNetCore.wwwroot.Models.DataModel;


namespace WebAppNetCore

{
    public class Program
    {
        
           
        
        public static void Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder(args);

           
            // Add services to the container.
            builder.Services.AddCors(options =>
            {
                options.AddPolicy("MyAllowedOrigins",
                    policy =>
                    {
                        policy.WithOrigins("https://localhost:80") // note the port is included 
                            .AllowAnyHeader()
                            .AllowAnyMethod();
                    });
            });

           
            builder.Services.AddRazorPages();

            
            

            var app = builder.Build();
            
            // Configure the HTTP request pipeline.
            if (!app.Environment.IsDevelopment())
            {
                app.UseExceptionHandler("/Error");
                // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
                app.UseHsts();
            }


            app.UseHttpsRedirection();
            app.UseStaticFiles();
            
            app.UseRouting();
            
            app.UseCors("MyAllowedOrigins");
            app.UseAuthorization();

            app.MapRazorPages();
            app.Run();

            
        }
        


    }
    
    

}