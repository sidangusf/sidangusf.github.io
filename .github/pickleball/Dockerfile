FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src
COPY Server/ Server/
RUN dotnet publish Server/CourtClub.csproj -c Release -o /app
FROM mcr.microsoft.com/dotnet/aspnet:8.0
WORKDIR /app
COPY --from=build /app .
ENV ASPNETCORE_HTTP_PORTS=8080
ENV CLUB_DATA_DIR=/data
EXPOSE 8080
USER app
ENTRYPOINT ["dotnet", "CourtClub.dll"]
