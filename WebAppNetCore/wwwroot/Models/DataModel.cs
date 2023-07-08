using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace WebAppNetCore.wwwroot.Models.DataModel;

public class DataModel
{
    [BsonId]
    [BsonRepresentation(BsonType.ObjectId)]
    public string Id { get; set; } = String.Empty;
    public string? Name { get; set; }
    public string? Data { get; set; }

}
